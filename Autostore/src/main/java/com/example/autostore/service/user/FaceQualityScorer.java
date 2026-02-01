package com.example.autostore.service.user;

import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.file.*;

import static org.bytedeco.opencv.global.opencv_core.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;

public final class FaceQualityScorer {

    private FaceQualityScorer() {}

    private static volatile CascadeClassifier FACE_CASCADE;

    private static CascadeClassifier getCascade() {
        if (FACE_CASCADE != null) return FACE_CASCADE;

        synchronized (FaceQualityScorer.class) {
            if (FACE_CASCADE != null) return FACE_CASCADE;

            try {
                ClassPathResource res = new ClassPathResource("models/haarcascade_frontalface_default.xml");
                Path tmp = Files.createTempFile("haarcascade_", ".xml");
                tmp.toFile().deleteOnExit();
                try (InputStream is = res.getInputStream()) {
                    Files.copy(is, tmp, StandardCopyOption.REPLACE_EXISTING);
                }

                FACE_CASCADE = new CascadeClassifier(tmp.toAbsolutePath().toString());
                if (FACE_CASCADE.empty()) throw new RuntimeException("FAILED_TO_LOAD_CASCADE");
                return FACE_CASCADE;

            } catch (Exception e) {
                throw new RuntimeException("Load haarcascade failed: " + e.getMessage(), e);
            }
        }
    }

    /** score 0..1 */
    public static double score(MultipartFile image) {
        Mat bgr = multipartToMat(image);
        if (bgr == null || bgr.empty()) return 0.0;

        Rect faceRect = detectLargestFace(bgr);
        Mat roi = (faceRect != null) ? new Mat(bgr, faceRect) : bgr;

        double sharp = sharpnessScore(roi);
        double bright = brightnessScore(roi);
        double size = faceSizeScore(bgr, faceRect);

        double score = 0.5 * sharp + 0.3 * bright + 0.2 * size;
        return clamp01(score);
    }

    private static Mat multipartToMat(MultipartFile file) {
        try {
            BufferedImage bi = ImageIO.read(file.getInputStream());
            if (bi == null) return new Mat();
            return bufferedImageToMat(bi);
        } catch (Exception e) {
            return new Mat();
        }
    }

    private static Rect detectLargestFace(Mat bgr) {
        CascadeClassifier cc = getCascade();
        if (cc.empty()) return null;

        Mat gray = new Mat();
        cvtColor(bgr, gray, COLOR_BGR2GRAY);
        equalizeHist(gray, gray);

        RectVector faces = new RectVector();
        cc.detectMultiScale(gray, faces, 1.1, 3, 0, new Size(80, 80), new Size());

        if (faces.size() == 0) return null;

        Rect best = faces.get(0);
        long bestArea = (long) best.width() * best.height();

        for (long i = 1; i < faces.size(); i++) {
            Rect r = faces.get(i);
            long area = (long) r.width() * r.height();
            if (area > bestArea) {
                best = r;
                bestArea = area;
            }
        }
        return best;
    }

    private static double sharpnessScore(Mat bgrOrRoi) {
        Mat gray = new Mat();
        cvtColor(bgrOrRoi, gray, COLOR_BGR2GRAY);

        Mat lap = new Mat();
        org.bytedeco.opencv.global.opencv_imgproc.Laplacian(gray, lap, CV_64F);

        Mat mean = new Mat();
        Mat std = new Mat();
        meanStdDev(lap, mean, std);

        double sigma = std.createIndexer().getDouble(0);
        double variance = sigma * sigma;

        double vMin = 30.0;
        double vMax = 200.0;
        return clamp01((variance - vMin) / (vMax - vMin));
    }

    private static double brightnessScore(Mat bgrOrRoi) {
        Mat gray = new Mat();
        cvtColor(bgrOrRoi, gray, COLOR_BGR2GRAY);

        double meanVal = mean(gray).get(0);
        double low = 60;
        double high = 200;

        if (meanVal < low) return clamp01(meanVal / low);
        if (meanVal > high) return clamp01((255 - meanVal) / (255 - high));
        return 1.0;
    }

    private static double faceSizeScore(Mat full, Rect faceRect) {
        if (faceRect == null) return 0.3;

        double fullArea = (double) full.rows() * full.cols();
        double faceArea = (double) faceRect.width() * faceRect.height();
        double ratio = faceArea / fullArea;

        double rMin = 0.06;
        double rMax = 0.18;
        return clamp01((ratio - rMin) / (rMax - rMin));
    }

    private static double clamp01(double x) {
        if (x < 0) return 0;
        if (x > 1) return 1;
        return x;
    }

    // same style as your provider
    private static Mat bufferedImageToMat(BufferedImage bi) {
        int w = bi.getWidth();
        int h = bi.getHeight();
        Mat mat = new Mat(h, w, CV_8UC3);

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
