package com.example.autostore.controller.admin;

import com.example.autostore.service.admin.ContractAdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/contracts")
public class ContractAdminController {

    private final ContractAdminService contractAdminService;

    public ContractAdminController(ContractAdminService contractAdminService) {
        this.contractAdminService = contractAdminService;
    }

    @PostMapping("/{contractId}/sign-digital")
    public ResponseEntity<?> signDigitalByAdmin(
            @PathVariable Integer contractId,
            HttpServletRequest request
    ) throws Exception {

        // nếu bạn có auth => lấy adminId từ SecurityContext. Tạm để null hoặc parse theo dự án bạn
        Integer adminId = null;

        String ip = getClientIp(request);
        String ua = request.getHeader("User-Agent");

        var c = contractAdminService.signDigitalByAdmin(contractId, adminId, ip, ua);

        return ResponseEntity.ok(Map.of(
                "contractId", c.getId(),
                "status", c.getStatus().name()
        ));
    }

    @GetMapping("/{contractId}/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            @PathVariable Integer contractId,
            @RequestParam(defaultValue = "digital") String type
    ) throws IOException {
        byte[] pdf = contractAdminService.loadPdf(contractId, type);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) return xf.split(",")[0].trim();
        return request.getRemoteAddr();
    }
}
