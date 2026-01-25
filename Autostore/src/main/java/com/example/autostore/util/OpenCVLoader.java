package com.example.autostore.util;

import nu.pattern.OpenCV;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class OpenCVLoader {
    @PostConstruct
    public void init() {
        OpenCV.loadLocally();
    }
}

