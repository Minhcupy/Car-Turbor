package com.example.autostore.util;

public final class FaceMath {
    private FaceMath() {}

    public static void l2NormalizeInPlace(float[] v) {
        double sum = 0;
        for (float x : v) sum += (double) x * x;
        double norm = Math.sqrt(sum);
        if (norm < 1e-12) return;
        float inv = (float) (1.0 / norm);
        for (int i = 0; i < v.length; i++) v[i] *= inv;
    }

    public static float dot(float[] a, float[] b) {
        if (a.length != b.length) throw new IllegalArgumentException("EMB_SIZE_MISMATCH");
        double s = 0;
        for (int i = 0; i < a.length; i++) s += (double) a[i] * b[i];
        return (float) s;
    }

    /** cosine similarity = dot(a,b) / (||a||*||b||) */
    public static float cosine(float[] a, float[] b) {
        if (a.length != b.length) throw new IllegalArgumentException("EMB_SIZE_MISMATCH");
        double dot = 0, na = 0, nb = 0;
        for (int i = 0; i < a.length; i++) {
            dot += (double) a[i] * b[i];
            na += (double) a[i] * a[i];
            nb += (double) b[i] * b[i];
        }
        double den = Math.sqrt(na) * Math.sqrt(nb);
        if (den < 1e-12) return 0f;
        return (float) (dot / den);
    }
}