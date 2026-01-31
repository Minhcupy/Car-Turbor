package com.example.autostore.util;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

public final class FaceEmbeddingCodec {
    private FaceEmbeddingCodec() {}

    public static byte[] toBytes(float[] emb) {
        ByteBuffer bb = ByteBuffer.allocate(emb.length * 4).order(ByteOrder.LITTLE_ENDIAN);
        bb.asFloatBuffer().put(emb);
        return bb.array();
    }

    public static float[] fromBytes(byte[] bytes) {
        if (bytes == null || bytes.length % 4 != 0) throw new IllegalArgumentException("INVALID_EMBEDDING_BYTES");
        FloatBuffer fb = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).asFloatBuffer();
        float[] out = new float[fb.remaining()];
        fb.get(out);
        return out;
    }
}
