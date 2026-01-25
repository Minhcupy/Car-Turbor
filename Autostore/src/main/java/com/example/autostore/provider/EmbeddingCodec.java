package com.example.autostore.provider;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public final class EmbeddingCodec {
    private EmbeddingCodec() {}

    public static byte[] toBytes(float[] vec) {
        ByteBuffer buf = ByteBuffer.allocate(vec.length * 4).order(ByteOrder.LITTLE_ENDIAN);
        for (float v : vec) buf.putFloat(v);
        return buf.array();
    }

    public static float[] fromBytes(byte[] bytes, int dim) {
        if (bytes == null) throw new IllegalArgumentException("embedding is null");
        if (bytes.length != dim * 4) throw new IllegalArgumentException("Invalid embedding length");
        float[] vec = new float[dim];
        ByteBuffer buf = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
        for (int i = 0; i < dim; i++) vec[i] = buf.getFloat();
        return vec;
    }
}
