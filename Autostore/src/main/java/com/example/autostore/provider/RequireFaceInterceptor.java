package com.example.autostore.provider;

import com.example.autostore.dto.user.FaceVerifiedCache;
import com.example.autostore.service.user.FaceRedisStore;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.messaging.handler.HandlerMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;
import java.util.Objects;

@Component
public class RequireFaceInterceptor implements HandlerInterceptor {

    private final FaceRedisStore store; // nơi bạn lưu token verify

    public RequireFaceInterceptor(FaceRedisStore store) {
        this.store = store;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod hm)) return true;

        RequireFace ann = hm.getMethodAnnotation(RequireFace.class);
        if (ann == null) return true;

        String faceToken = request.getHeader("X-Face-Verified");
        if (faceToken == null || faceToken.isBlank()) {
            response.sendError(403, "FACE_REQUIRED");
            return false;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            response.sendError(401, "UNAUTHORIZED");
            return false;
        }

        String username = auth.getName(); // ✅ đúng theo code của bạn

        // lấy resourceId từ path variable nếu có
        String resourceId = "";
        if (!ann.resourceParam().isBlank()) {
            @SuppressWarnings("unchecked")
            Map<String, String> uriVars = (Map<String, String>) request.getAttribute(
                    HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE
            );
            resourceId = (uriVars != null) ? uriVars.get(ann.resourceParam()) : null;

            if (resourceId == null) {
                response.sendError(500, "RESOURCE_ID_NOT_FOUND");
                return false;
            }
        }

        FaceVerifiedCache fv = store.getVerifiedToken(faceToken).orElse(null);
        if (fv == null
                || !fv.username().equals(username)
                || !fv.action().equals(ann.action())
                || !fv.resourceId().equals(resourceId)) {
            response.sendError(403, "FACE_NOT_VERIFIED");
            return false;
        }

        // one-time token (khuyên)
        store.consume(faceToken);

        return true;
    }
}

