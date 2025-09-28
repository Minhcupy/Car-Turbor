package com.example.autostore.service.user.interfaces;

import com.example.autostore.dto.user.BookingPreviewDTO;
import com.example.autostore.dto.user.BookingRequestDTO;
import com.example.autostore.dto.user.BookingResponseDTO;

import java.util.List;

public interface IBookingUserService {
    BookingPreviewDTO previewBooking(BookingRequestDTO dto);
    BookingResponseDTO createBooking(BookingRequestDTO dto);
    List<BookingResponseDTO> getAllByCustomer(Integer customerId);
    BookingResponseDTO getBookingById(Integer bookingId);
    
}
