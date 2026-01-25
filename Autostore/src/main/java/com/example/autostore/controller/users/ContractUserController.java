package com.example.autostore.controller.users;

import com.example.autostore.dto.user.SignElectronicRequest;
import com.example.autostore.model.Contract;
import com.example.autostore.model.Customer;
import com.example.autostore.model.AppUser;
import com.example.autostore.repository.ContractRepository;
import com.example.autostore.repository.ICustomerRepository;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.ContractService;
import com.example.autostore.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
@RequestMapping("/api/user/contracts")
@RequiredArgsConstructor
public class ContractUserController {

    private final ContractRepository contractRepository;
    private final ContractService contractService;
    private final UserRepository userRepository;
    private final ICustomerRepository customerRepository;
    private final StorageService storageService;

    private Customer getCurrentCustomer(Authentication auth) {
        String username = auth.getName();
        AppUser user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user: " + username));
        return customerRepository.findByAppUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy customer cho user: " + username));
    }

    @GetMapping("/by-booking/{bookingId}")
    public Contract getByBooking(@PathVariable Integer bookingId, Authentication auth) {
        Customer customer = getCurrentCustomer(auth);
        Contract c = contractRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contract"));

        if (!c.getBooking().getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new RuntimeException("Không có quyền xem contract này");
        }
        return c;
    }

    @PostMapping("/{contractId}/sign-electronic")
    public Contract signElectronic(@PathVariable Integer contractId,
                                   @RequestBody SignElectronicRequest req,
                                   Authentication auth,
                                   HttpServletRequest http) throws Exception {
        Customer customer = getCurrentCustomer(auth);
        return contractService.signElectronic(
                contractId,
                customer.getCustomerId(),
                req,
                http.getRemoteAddr(),
                http.getHeader("User-Agent")
        );
    }

    @GetMapping("/{contractId}/download")
    public ResponseEntity<byte[]> download(@PathVariable Integer contractId,
                                           @RequestParam String type,
                                           Authentication auth) throws IOException {

        Customer customer = getCurrentCustomer(auth);

        Contract c = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contract"));

        if (!c.getBooking().getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new RuntimeException("Không có quyền tải contract này");
        }

        // ✅ Nếu user muốn tải unsigned mà chưa có -> tự render + save
        if ("unsigned".equals(type) && c.getPdfUnsignedPath() == null) {
            try {
                contractService.ensureUnsignedPdf(contractId);
                c = contractRepository.findById(contractId).orElseThrow();
            } catch (Exception e) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Không tạo được file unsigned: " + e.getMessage()
                );
            }
        }

        String path = switch (type) {
            case "unsigned" -> c.getPdfUnsignedPath();
            case "electronic" -> c.getPdfElectronicSignedPath();
            case "digital" -> c.getPdfDigitalSignedPath();
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "type phải là unsigned|electronic|digital");
        };

        if (path == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "File chưa sẵn sàng");
        }

        byte[] data = storageService.readBytes(path);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "inline; filename=\"" + type + "_" + contractId + ".pdf\"")
                .body(data);
    }

    @PostMapping("/{contractId}/sign-digital")
    public Contract signDigital(@PathVariable Integer contractId,
                                Authentication auth,
                                HttpServletRequest http) throws Exception {
        Customer customer = getCurrentCustomer(auth);
        return contractService.signDigital(
                contractId,
                customer.getCustomerId(),
                http.getRemoteAddr(),
                http.getHeader("User-Agent")
        );
    }
}
