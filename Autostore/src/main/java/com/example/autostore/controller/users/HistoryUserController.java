package com.example.autostore.controller.users;

import com.example.autostore.dto.user.BookingDetailDTO;
import com.example.autostore.dto.user.BookingHistoryDTO;
import com.example.autostore.service.user.interfaces.IHistoryUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/historybooking")
@RequiredArgsConstructor
public class HistoryUserController {

    private final IHistoryUserService historyUserService;

    /**
     * Danh sách lịch sử đơn hàng của user hiện tại
     */
    @GetMapping
    public ResponseEntity<List<BookingHistoryDTO>> getBookingHistory(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        List<BookingHistoryDTO> history = historyUserService.getBookingHistory(username);
        return ResponseEntity.ok(history);
    }

    /**
     * Xem chi tiết 1 đơn hàng
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingDetail(
            Authentication authentication,
            @PathVariable Integer bookingId
    ) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();
        BookingDetailDTO detail = historyUserService.getBookingDetail(username, bookingId);
        if (detail == null) {
            return ResponseEntity.status(404).body("Booking not found");
        }
        return ResponseEntity.ok(detail);
    }

    /**
     * Hủy đơn hàng (nếu đang PENDING)
     */
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> cancelBooking(
            Authentication authentication,
            @PathVariable Integer bookingId
    ) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();
        boolean success = historyUserService.cancelBooking(username, bookingId);

        if (!success) {
            return ResponseEntity.badRequest().body("Không thể hủy đơn hàng (chỉ khi đang PENDING)");
        }
        return ResponseEntity.ok("Đơn hàng đã được hủy thành công");
    }
}
