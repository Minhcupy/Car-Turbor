package com.example.autostore.service.admin;

import com.example.autostore.Enum.ContractStatus;
import com.example.autostore.model.Contract;
import com.example.autostore.model.ContractSignature;
import com.example.autostore.repository.ContractRepository;
import com.example.autostore.repository.ContractSignatureRepository;
import com.example.autostore.service.DigitalSignService;
import com.example.autostore.service.StorageService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ContractAdminService {

    private final ContractRepository contractRepo;
    private final ContractSignatureRepository sigRepo;
    private final StorageService storageService;
    private final DigitalSignService digitalSignService;

    public ContractAdminService(
            ContractRepository contractRepo,
            ContractSignatureRepository sigRepo,
            StorageService storageService,
            DigitalSignService digitalSignService
    ) {
        this.contractRepo = contractRepo;
        this.sigRepo = sigRepo;
        this.storageService = storageService;
        this.digitalSignService = digitalSignService;
    }

    /**
     * Admin ký số để hoàn tất hợp đồng.
     * Điều kiện:
     *  - status phải SIGNED_ELECTRONIC
     *  - phải có pdfElectronicSignedPath
     */
    @Transactional
    public Contract signDigitalByAdmin(Integer contractId, Integer adminId, String ip, String userAgent) throws Exception {

        Contract c = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contract"));

        if (c.getStatus() != ContractStatus.SIGNED_ELECTRONIC) {
            throw new RuntimeException("Chỉ ký số khi contract ở trạng thái SIGNED_ELECTRONIC");
        }

        if (c.getPdfElectronicSignedPath() == null) {
            throw new RuntimeException("Chưa có file PDF ký điện tử (pdfElectronicSignedPath)");
        }

        // customerId bắt buộc (NOT NULL)
        if (c.getBooking() == null || c.getBooking().getCustomer() == null) {
            throw new RuntimeException("Contract thiếu booking/customer => không thể audit chữ ký");
        }
        Integer customerId = c.getBooking().getCustomer().getCustomerId();

        // sign pdf
        byte[] pdfToSign = storageService.readBytes(c.getPdfElectronicSignedPath());
        var result = digitalSignService.signPdf(pdfToSign);

        String digitalPath = storageService.saveBytes(
                result.signedPdf,
                "contracts/" + c.getId() + "/signed_digital_admin.pdf"
        );

        c.setPdfDigitalSignedPath(digitalPath);
        c.setStatus(ContractStatus.SIGNED_DIGITAL);

        // audit
        ContractSignature sig = ContractSignature.builder()
                .contract(c)
                .customerId(customerId) // ✅ required
                .type("ADMIN_PKI_SERVER") // ✅ required, phân biệt admin
                .ip(ip)
                .userAgent(userAgent)
                .digitalCertSubject(result.certSubject)
                .digitalVerifyStatus("UNKNOWN")
                .evidenceJson("{\"step\":\"ADMIN_SIGN_DIGITAL\",\"adminId\":" + (adminId == null ? "null" : adminId) + "}")
                .build();

        sigRepo.save(sig);

        return contractRepo.save(c);
    }

    /**
     * Admin tải PDF theo loại: unsigned | electronic | digital
     */
    public byte[] loadPdf(Integer contractId, String type) throws IOException {
        Contract c = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contract"));

        String path = switch (type == null ? "" : type.toLowerCase()) {
            case "unsigned" -> c.getPdfUnsignedPath();
            case "electronic" -> c.getPdfElectronicSignedPath();
            case "digital" -> c.getPdfDigitalSignedPath();
            default -> c.getPdfDigitalSignedPath();
        };

        if (path == null) {
            throw new RuntimeException("PDF chưa tồn tại cho type=" + type);
        }
        return storageService.readBytes(path);
    }
}
