package com.example.autostore.provider;

import ai.onnxruntime.*;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.FloatBuffer;
import java.util.Collections;

@Service
public class ArcFaceOnnxProvider implements FaceProvider {

    private final OrtEnvironment env;
    private final OrtSession session;
    private final String inputName;

    private final CascadeClassifier faceCascade;

    public ArcFaceOnnxProvider() {
        try {
            // 1) ONNX
            env = OrtEnvironment.getEnvironment();
            OrtSession.SessionOptions opts = new OrtSession.SessionOptions();

            ClassPathResource modelRes = new ClassPathResource("models/arcface.onnx");
            try (InputStream is = modelRes.getInputStream()) {
                session = env.createSession(is.readAllBytes(), opts);
            }
            inputName = session.getInputNames().iterator().next();

            // 2) OpenCV cascade
            ClassPathResource casRes = new ClassPathResource("models/haarcascade_frontalface_default.xml");
            String casPath = casRes.getFile().getAbsolutePath(); // works in dev; for jar need temp extract
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

            // 1) detect face + crop
            BufferedImage face = detectAndCropFace(bi); // throw FACE_NOT_DETECTED

            // 2) resize 112x112
            BufferedImage resized = resize(face, 112, 112);

            // 3) preprocess -> CHW float (normalize to [-1, 1])
            float[] chw = toCHWNormalized(resized);

            // 4) infer
            long[] shape = new long[]{1, 3, 112, 112};
            try (OnnxTensor inputTensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(chw), shape)) {
                try (OrtSession.Result out = session.run(Collections.singletonMap(inputName, inputTensor))) {

                    Object v = out.get(0).getValue();
                    float[] emb = flatten(v);      // [512]
                    l2NormalizeInPlace(emb);
                    return emb;
                }
            }
        } catch (RuntimeException re) {
            throw re;
        } catch (Exception e) {
            throw new RuntimeException("EXTRACT_EMBEDDING_FAILED", e);
        }
    }

    // ---------------- helpers ----------------

    private BufferedImage detectAndCropFace(BufferedImage bi) {
        Mat mat = bufferedImageToMat(bi);

        // detect faces
        RectVector faces = new RectVector();
        faceCascade.detectMultiScale(mat, faces);

        if (faces.size() == 0) throw new RuntimeException("FACE_NOT_DETECTED");

        // pick largest face
        Rect best = faces.get(0);
        for (long i = 1; i < faces.size(); i++) {
            Rect r = faces.get(i);
            if (r.width() * r.height() > best.width() * best.height()) best = r;
        }

        // add a bit margin
        int x = Math.max(best.x() - best.width() / 10, 0);
        int y = Math.max(best.y() - best.height() / 10, 0);
        int w = Math.min(best.width() + best.width() / 5, bi.getWidth() - x);
        int h = Math.min(best.height() + best.height() / 5, bi.getHeight() - y);

        BufferedImage cropped = bi.getSubimage(x, y, w, h);
        return cropped;
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
        if (onnxOutput instanceof float[][] arr2) return arr2[0]; // [1,512]
        if (onnxOutput instanceof float[] arr1) return arr1;      // [512]
        throw new RuntimeException("UNSUPPORTED_ONNX_OUTPUT: " + onnxOutput.getClass());
    }

    private static void l2NormalizeInPlace(float[] v) {
        double sum = 0;
        for (float x : v) sum += (double) x * x;
        double norm = Math.sqrt(sum);
        if (norm < 1e-12) return;
        float inv = (float) (1.0 / norm);
        for (int i = 0; i < v.length; i++) v[i] *= inv;
    }

    private static Mat bufferedImageToMat(BufferedImage bi) {
        // convert BufferedImage -> Mat (BGR)
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
}
