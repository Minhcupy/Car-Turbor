package com.example.autostore.util;

import com.example.autostore.service.user.FaceVerifiedTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class RequireFaceInterceptor implements HandlerInterceptor {

    public static final String FACE_HEADER = "X-Face-Verified";

    private final FaceVerifiedTokenService tokenService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod hm)) return true;

        RequireFace ann = hm.getMethodAnnotation(RequireFace.class);
        if (ann == null) return true;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw new RuntimeException("UNAUTHORIZED");

        String username = auth.getName();
        String token = request.getHeader(FACE_HEADER);

        tokenService.verifyOrThrow(token, username, ann.action());
        return true;
    }
}
