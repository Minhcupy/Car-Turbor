package com.example.autostore.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;

@Service
public class StorageService {

    @Value("${app.storage.base-dir}")
    private String baseDir;

    public String saveBytes(byte[] data, String relativePath) throws IOException {
        Path path = Paths.get(baseDir, relativePath).normalize();
        Files.createDirectories(path.getParent());
        Files.write(path, data);
        return path.toString();
    }

    public byte[] readBytes(String absolutePath) throws IOException {
        return Files.readAllBytes(Paths.get(absolutePath));
    }
}
