package com.example.autostore.service;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.Enum.ContractStatus;
import com.example.autostore.dto.user.SignElectronicRequest;
import com.example.autostore.model.Contract;
import com.example.autostore.model.ContractSignature;
import com.example.autostore.repository.ContractRepository;
import com.example.autostore.repository.ContractSignatureRepository;
import com.example.autostore.repository.IBookingRepository;
import com.example.autostore.util.ContractUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ContractService {

    private final ContractRepository contractRepo;
    private final ContractSignatureRepository sigRepo;
    private final IBookingRepository bookingRepo;

    private final PdfRenderService pdfRenderService;
    private final PdfStampService pdfStampService;
    private final StorageService storageService;
    private final DigitalSignService digitalSignService;

    public ContractService(ContractRepository contractRepo,
                           ContractSignatureRepository sigRepo,
                           IBookingRepository bookingRepo,
                           PdfRenderService pdfRenderService,
                           PdfStampService pdfStampService,
                           StorageService storageService, DigitalSignService digitalSignService) {
        this.contractRepo = contractRepo;
        this.sigRepo = sigRepo;
        this.bookingRepo = bookingRepo;
        this.pdfRenderService = pdfRenderService;
        this.pdfStampService = pdfStampService;
        this.storageService = storageService;
        this.digitalSignService = digitalSignService;
    }

    @Transactional
    public Contract signElectronic(Integer contractId, Integer customerId, SignElectronicRequest req,
                                   String ip, String userAgent) throws Exception {

        if (!req.isConsent()) throw new RuntimeException("Bạn phải đồng ý điều khoản trước khi ký");

        Contract c = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contract"));

        var booking = c.getBooking();

        // 1) quyền sở hữu
        if (!booking.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Không có quyền ký hợp đồng này");
        }

        // 2) ràng buộc trạng thái
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking không ở trạng thái PENDING");
        }
        if (c.getStatus() != ContractStatus.DRAFT) {
            throw new RuntimeException("Contract không ở trạng thái DRAFT");
        }

        // 3) đóng băng nội dung
        c.setContentHash(ContractUtil.sha256Hex(c.getContentHtml()));

        // 4) render unsigned
        byte[] unsignedPdf = pdfRenderService.renderFromHtml(c.getContentHtml());
        c.setPdfUnsignedPath(storageService.saveBytes(unsignedPdf, "contracts/" + c.getId() + "/unsigned.pdf"));

        // 5) lưu chữ ký PNG
        byte[] png = ContractUtil.decodeDataUrl(req.getSignaturePngBase64());
        String sigPath = storageService.saveBytes(png, "contracts/" + c.getId() + "/signature.png");

        // 6) stamp lên pdf
        byte[] stamped = pdfStampService.stampSignature(unsignedPdf, png, req.getSignerName());
        c.setPdfElectronicSignedPath(storageService.saveBytes(stamped, "contracts/" + c.getId() + "/signed_electronic.pdf"));

        // 7) update trạng thái
        c.setStatus(ContractStatus.SIGNED_ELECTRONIC);
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(booking);

        // 8) audit signature
        ContractSignature sig = ContractSignature.builder()
                .contract(c)
                .customerId(customerId)
                .type("DRAWN")
                .signatureImagePath(sigPath)
                .ip(ip)
                .userAgent(userAgent)
                .evidenceJson("{\"consent\":true,\"signerName\":\"" + req.getSignerName() + "\"}")
                .build();
        sigRepo.save(sig);

        return contractRepo.save(c);
    }

    @Transactional
    public Contract signDigital(Integer contractId, Integer customerId, String ip, String userAgent) throws Exception {
        Contract c = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contract"));

        var booking = c.getBooking();

        // quyền sở hữu
        if (!booking.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Không có quyền ký số contract này");
        }

        // chỉ ký số sau khi đã ký A
        if (c.getStatus() != ContractStatus.SIGNED_ELECTRONIC) {
            throw new RuntimeException("Phải ký điện tử trước (SIGNED_ELECTRONIC) rồi mới ký số");
        }

        if (c.getPdfElectronicSignedPath() == null) {
            throw new RuntimeException("Chưa có file PDF ký điện tử");
        }

        byte[] pdfToSign = storageService.readBytes(c.getPdfElectronicSignedPath());
        var result = digitalSignService.signPdf(pdfToSign);

        String digitalPath = storageService.saveBytes(
                result.signedPdf,
                "contracts/" + c.getId() + "/signed_digital.pdf"
        );

        c.setPdfDigitalSignedPath(digitalPath);
        c.setStatus(ContractStatus.SIGNED_DIGITAL);

        ContractSignature sig = ContractSignature.builder()
                .contract(c)
                .customerId(customerId)
                .type("PKI_SERVER")
                .ip(ip)
                .userAgent(userAgent)
                .digitalCertSubject(result.certSubject)
                .digitalVerifyStatus("UNKNOWN")
                .evidenceJson("{\"step\":\"SIGN_DIGITAL_SERVER\"}")
                .build();
        sigRepo.save(sig);

        return contractRepo.save(c);
    }

    @Transactional
    public Contract ensureUnsignedPdf(Integer contractId) throws Exception {
        Contract c = contractRepo.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contract"));

        // đã có file thì thôi
        if (c.getPdfUnsignedPath() != null) return c;

        // nếu status null thì set DRAFT cho chắc
        if (c.getStatus() == null) c.setStatus(ContractStatus.DRAFT);

        // render unsigned từ HTML
        byte[] unsignedPdf = pdfRenderService.renderFromHtml(c.getContentHtml());
        String path = storageService.saveBytes(unsignedPdf, "contracts/" + c.getId() + "/unsigned.pdf");

        c.setPdfUnsignedPath(path);
        return contractRepo.save(c);
    }
}
