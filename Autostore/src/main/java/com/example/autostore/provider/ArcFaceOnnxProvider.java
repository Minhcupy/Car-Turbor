package com.example.autostore.provider;

import ai.onnxruntime.*;
import com.example.autostore.model.UserFaceTemplate;
import com.example.autostore.util.FaceEmbeddingCodec;
import com.example.autostore.util.FaceMath;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.FloatBuffer;
import java.nio.file.*;
import java.util.Collections;

import static org.bytedeco.opencv.global.opencv_imgproc.*;

@Service
public class ArcFaceOnnxProvider implements FaceProvider {

    private final OrtEnvironment env;
    private final OrtSession session;
    private final String inputName;
    private final CascadeClassifier faceCascade;

    private final float threshold;

    public ArcFaceOnnxProvider(@Value("${face.arcface.threshold}") float threshold) {
        try {
            this.threshold = threshold;

            env = OrtEnvironment.getEnvironment();
            OrtSession.SessionOptions opts = new OrtSession.SessionOptions();

            ClassPathResource modelRes = new ClassPathResource("models/arcface.onnx");
            try (InputStream is = modelRes.getInputStream()) {
                session = env.createSession(is.readAllBytes(), opts);
            }

            inputName = session.getInputNames().iterator().next();

            ClassPathResource casRes = new ClassPathResource("models/haarcascade_frontalface_default.xml");
            String casPath = extractResourceToTempFile(casRes, ".xml");
            faceCascade = new CascadeClassifier(casPath);
            if (faceCascade.empty()) throw new RuntimeException("FAILED_TO_LOAD_CASCADE");

        } catch (Exception e) {
            throw new RuntimeException("FAILED_TO_INIT_FACE_PROVIDER", e);
        }
    }

    @Override
    public float[] extractEmbedding(MultipartFile image) {
        if (image == null || image.isEmpty()) throw new RuntimeException("IMAGE_REQUIRED");
        try {
            BufferedImage bi = ImageIO.read(image.getInputStream());
            if (bi == null) throw new RuntimeException("INVALID_IMAGE");

            BufferedImage face = detectAndCropFace(bi);
            BufferedImage resized = resize(face, 112, 112);

            float[] chw = toCHWNormalized(resized);

            long[] shape = new long[]{1, 3, 112, 112};
            try (OnnxTensor inputTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(chw), shape)) {
                try (OrtSession.Result out = session.run(Collections.singletonMap(inputName, inputTensor))) {
                    Object v = out.get(0).getValue();
                    float[] emb = flatten(v);   // [512]
                    FaceMath.l2NormalizeInPlace(emb);
                    return emb;
                }
            }

        } catch (RuntimeException re) {
            throw re;
        } catch (Exception e) {
            throw new RuntimeException("EXTRACT_EMBEDDING_FAILED", e);
        }
    }

    @Override
    public boolean verify(MultipartFile image, UserFaceTemplate template) {
        if (template == null || template.getEmbedding() == null) throw new RuntimeException("FACE_NOT_ENROLLED");

        float[] current = extractEmbedding(image); // normalized
        float[] stored = FaceEmbeddingCodec.fromBytes(template.getEmbedding());
        FaceMath.l2NormalizeInPlace(stored);

        float sim = FaceMath.dot(stored, current); // normalized => dot = cosine
        System.out.println("[ArcFace] cosine=" + sim + " threshold=" + threshold);

        return sim >= threshold;
    }

    // ===== detect/crop =====
    private BufferedImage detectAndCropFace(BufferedImage bi) {
        Mat bgr = bufferedImageToMat(bi);

        Mat gray = new Mat();
        cvtColor(bgr, gray, COLOR_BGR2GRAY);
        equalizeHist(gray, gray);

        RectVector faces = new RectVector();

        faceCascade.detectMultiScale(
                gray, faces,
                1.1, 10, 0,
                new Size(110, 110),
                new Size()
        );

        if (faces.size() == 0) throw new RuntimeException("FACE_NOT_DETECTED");

        // ✅ 1) CHẶN NHIỀU MẶT: ảnh có bạn + ảnh trên điện thoại => fail luôn
        if (faces.size() > 1) throw new RuntimeException("MULTI_FACE_NOT_ALLOWED");

        // ✅ 2) Chọn face gần trung tâm ảnh (ổn hơn "largest")
        Rect best = faces.get(0);
        best = pickMostCentralFace(faces, bi.getWidth(), bi.getHeight());

        // ✅ margin nhỏ để giảm dính background (màn hình điện thoại)
        int mx = Math.max(best.width() / 12, 8);
        int my = Math.max(best.height() / 12, 8);

        int x = Math.max(best.x() - mx, 0);
        int y = Math.max(best.y() - my, 0);
        int w = Math.min(best.width() + 2 * mx, bi.getWidth() - x);
        int h = Math.min(best.height() + 2 * my, bi.getHeight() - y);

        if (w < 80 || h < 80) throw new RuntimeException("FACE_LOW_QUALITY");

        // ✅ 3) Face phải chiếm đủ diện tích ảnh (chống “mặt nhỏ trên màn hình”)
        double areaRatio = (w * 1.0 * h) / (bi.getWidth() * 1.0 * bi.getHeight());
        if (areaRatio < 0.10) throw new RuntimeException("FACE_TOO_SMALL"); // tune 0.08 - 0.15

        BufferedImage crop = bi.getSubimage(x, y, w, h);

        // ✅ 4) Quality gate (blur/brightness)
        if (isTooBlurry(crop)) throw new RuntimeException("FACE_BLURRY");
        if (isTooDarkOrBright(crop)) throw new RuntimeException("FACE_BAD_LIGHT");

        return crop;
    }

    private static BufferedImage resize(BufferedImage src, int w, int h) {
        BufferedImage dst = new BufferedImage(w, h, BufferedImage.TYPE_3BYTE_BGR);
        Graphics2D g = dst.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(src, 0, 0, w, h, null);
        g.dispose();
        return dst;
    }

    private static float[] toCHWNormalized(BufferedImage img112) {
        int w = 112, h = 112;
        float[] out = new float[3 * w * h];

        int baseR = 0;
        int baseG = w * h;
        int baseB = 2 * w * h;

        for (int yy = 0; yy < h; yy++) {
            for (int xx = 0; xx < w; xx++) {
                int rgb = img112.getRGB(xx, yy);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                float rf = (r - 127.5f) / 128.0f;
                float gf = (g - 127.5f) / 128.0f;
                float bf = (b - 127.5f) / 128.0f;

                int p = yy * w + xx;
                out[baseR + p] = rf;
                out[baseG + p] = gf;
                out[baseB + p] = bf;
            }
        }
        return out;
    }

    private static float[] flatten(Object onnxOutput) {
        if (onnxOutput instanceof float[][] arr2) return arr2[0];
        if (onnxOutput instanceof float[] arr1) return arr1;
        throw new RuntimeException("UNSUPPORTED_ONNX_OUTPUT: " + onnxOutput.getClass());
    }

    private static Mat bufferedImageToMat(BufferedImage bi) {
        int w = bi.getWidth();
        int h = bi.getHeight();
        Mat mat = new Mat(h, w, org.bytedeco.opencv.global.opencv_core.CV_8UC3);

        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int rgb = bi.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;
                mat.ptr(y, x).put((byte) b, (byte) g, (byte) r);
            }
        }
        return mat;
    }

    private static String extractResourceToTempFile(ClassPathResource res, String suffix) throws Exception {
        Path tmp = Files.createTempFile("cascade_", suffix);
        try (InputStream in = res.getInputStream()) {
            Files.copy(in, tmp, StandardCopyOption.REPLACE_EXISTING);
        }
        tmp.toFile().deleteOnExit();
        return tmp.toAbsolutePath().toString();
    }

    private static Rect pickMostCentralFace(RectVector faces, int imgW, int imgH) {
        double cx = imgW / 2.0;
        double cy = imgH / 2.0;

        Rect best = faces.get(0);
        double bestDist = Double.MAX_VALUE;

        for (long i = 0; i < faces.size(); i++) {
            Rect r = faces.get(i);
            double rcx = r.x() + r.width() / 2.0;
            double rcy = r.y() + r.height() / 2.0;
            double dist = (rcx - cx) * (rcx - cx) + (rcy - cy) * (rcy - cy);
            if (dist < bestDist) {
                bestDist = dist;
                best = r;
            }
        }
        return best;
    }

    private static boolean isTooBlurry(BufferedImage img) {
        Mat m = bufferedImageToMat(img);
        Mat gray = new Mat();
        cvtColor(m, gray, COLOR_BGR2GRAY);

        Mat lap = new Mat();
        org.bytedeco.opencv.global.opencv_imgproc.Laplacian(gray, lap, org.bytedeco.opencv.global.opencv_core.CV_64F);

        Mat mean = new Mat();
        Mat stddev = new Mat();
        org.bytedeco.opencv.global.opencv_core.meanStdDev(lap, mean, stddev);

        double sigma = stddev.createIndexer().getDouble(0);
        double var = sigma * sigma;

        // var càng thấp càng mờ (tune: 60~200 tuỳ camera)
        return var < 120.0;
    }

    private static boolean isTooDarkOrBright(BufferedImage img) {
        Mat m = bufferedImageToMat(img);
        Mat gray = new Mat();
        cvtColor(m, gray, COLOR_BGR2GRAY);

        // mean brightness
        Scalar s = org.bytedeco.opencv.global.opencv_core.mean(gray);
        double mean = s.get(0);

        // tune: 60-200
        return mean < 60 || mean > 200;
    }
}
