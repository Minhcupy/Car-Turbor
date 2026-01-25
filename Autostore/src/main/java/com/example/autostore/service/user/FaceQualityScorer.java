package com.example.autostore.service.user;

import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

public class FaceQualityScorer {

    private static volatile CascadeClassifier FACE_CASCADE;

    private static CascadeClassifier getCascade() {
        if (FACE_CASCADE != null) return FACE_CASCADE;

        synchronized (FaceQualityScorer.class) {
            if (FACE_CASCADE != null) return FACE_CASCADE;

            try (InputStream is = FaceQualityScorer.class.getResourceAsStream(
                    "/models/haarcascade_frontalface_default.xml")) {

                if (is == null) {
                    throw new IllegalStateException("Missing resource: /models/haarcascade_frontalface_default.xml");
                }

                File tmp = File.createTempFile("haarcascade_", ".xml");
                tmp.deleteOnExit();
                Files.copy(is, tmp.toPath(), StandardCopyOption.REPLACE_EXISTING);

                FACE_CASCADE = new CascadeClassifier(tmp.getAbsolutePath());
                return FACE_CASCADE;

            } catch (Exception e) {
                throw new RuntimeException("Load haarcascade failed: " + e.getMessage(), e);
            }
        }
    }

    public static double score(MultipartFile image) {
        Mat bgr = multipartToMat(image);
        if (bgr.empty()) return 0.0;

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
            byte[] bytes = file.getBytes();
            Mat buf = new MatOfByte(bytes);
            return Imgcodecs.imdecode(buf, Imgcodecs.IMREAD_COLOR);
        } catch (Exception e) {
            return new Mat();
        }
    }

    private static Rect detectLargestFace(Mat bgr) {
        CascadeClassifier cc = getCascade();
        if (cc.empty()) return null;

        Mat gray = new Mat();
        Imgproc.cvtColor(bgr, gray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.equalizeHist(gray, gray);

        MatOfRect faces = new MatOfRect();
        cc.detectMultiScale(gray, faces, 1.1, 3, 0, new Size(80, 80), new Size());

        Rect[] arr = faces.toArray();
        if (arr.length == 0) return null;

        Rect best = arr[0];
        for (Rect r : arr) if (r.area() > best.area()) best = r;
        return best;
    }

    private static double sharpnessScore(Mat bgrOrRoi) {
        Mat gray = new Mat();
        Imgproc.cvtColor(bgrOrRoi, gray, Imgproc.COLOR_BGR2GRAY);

        Mat lap = new Mat();
        Imgproc.Laplacian(gray, lap, CvType.CV_64F);

        MatOfDouble mean = new MatOfDouble();
        MatOfDouble std = new MatOfDouble();
        Core.meanStdDev(lap, mean, std);

        double variance = Math.pow(std.get(0, 0)[0], 2);

        double vMin = 30.0;
        double vMax = 200.0;
        return clamp01((variance - vMin) / (vMax - vMin));
    }

    private static double brightnessScore(Mat bgrOrRoi) {
        Mat gray = new Mat();
        Imgproc.cvtColor(bgrOrRoi, gray, Imgproc.COLOR_BGR2GRAY);

        double mean = Core.mean(gray).val[0];
        double low = 60;
        double high = 200;

        if (mean < low) return clamp01(mean / low);
        if (mean > high) return clamp01((255 - mean) / (255 - high));
        return 1.0;
    }

    private static double faceSizeScore(Mat full, Rect faceRect) {
        if (faceRect == null) return 0.3;
        double ratio = faceRect.area() / ((double) full.rows() * full.cols());

        double rMin = 0.06;
        double rMax = 0.18;
        return clamp01((ratio - rMin) / (rMax - rMin));
    }

    private static double clamp01(double x) {
        if (x < 0) return 0;
        if (x > 1) return 1;
        return x;
    }
}
