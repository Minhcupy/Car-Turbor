package com.example.autostore.service.user.interfaces;

import com.example.autostore.dto.user.BookingDetailDTO;
import com.example.autostore.dto.user.BookingHistoryDTO;

import java.util.List;

public interface IHistoryUserService {
    List<BookingHistoryDTO> getBookingHistory(String username);
    BookingDetailDTO getBookingDetail(String username, Integer bookingId);
    boolean cancelBooking(String username, Integer bookingId);
}
