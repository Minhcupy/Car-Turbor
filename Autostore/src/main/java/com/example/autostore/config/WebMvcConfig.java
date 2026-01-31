package com.example.autostore.config;

import com.example.autostore.util.RequireFaceInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final RequireFaceInterceptor requireFaceInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requireFaceInterceptor)
                .addPathPatterns("/api/**"); // hoặc chỉ /api/user/bookings nếu bạn muốn chặt hơn
    }
}
