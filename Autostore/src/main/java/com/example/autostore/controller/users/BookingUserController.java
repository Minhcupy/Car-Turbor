package com.example.autostore.controller.users;


import com.example.autostore.dto.user.BookingPreviewDTO;
import com.example.autostore.dto.user.BookingRequestDTO;
import com.example.autostore.dto.user.BookingResponseDTO;
import com.example.autostore.dto.user.CarItemDTO;
import com.example.autostore.service.user.implement.BookingUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/bookings")
@RequiredArgsConstructor
public class BookingUserController {
    private final BookingUserService bookingService;


    @PostMapping("/preview")
    public ResponseEntity<BookingPreviewDTO> previewBooking(@RequestBody BookingRequestDTO request) {
        return ResponseEntity.ok(bookingService.previewBooking(request));
    }


    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequestDTO request,
            Authentication authentication) {
        String username = authentication.getName(); // 👈 user hiện tại từ JWT
        return ResponseEntity.ok(bookingService.createBooking(request, username));
    }


    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByCustomer(@PathVariable Integer customerId) {
        return ResponseEntity.ok(bookingService.getAllByCustomer(customerId));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Integer bookingId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId));
    }


}
