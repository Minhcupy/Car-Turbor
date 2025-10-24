package com.example.autostore.service.user.implement;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.dto.user.BookingDetailDTO;
import com.example.autostore.dto.user.BookingHistoryDTO;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Customer;
import com.example.autostore.model.Payment;
import com.example.autostore.repository.IBookingRepository;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.user.interfaces.IHistoryUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryUserService implements IHistoryUserService {

    private final IBookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    public List<BookingHistoryDTO> getBookingHistory(String username) {
        AppUser user = userRepository.findByUserName(username).orElse(null);
        if (user == null || user.getCustomer() == null) return List.of();

        Customer customer = user.getCustomer();
        return bookingRepository.findByCustomer(customer)
                .stream()
                .map(this::mapToHistoryDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDetailDTO getBookingDetail(String username, Integer bookingId) {
        AppUser user = userRepository.findByUserName(username).orElse(null);
        if (user == null || user.getCustomer() == null) return null;

        return bookingRepository.findById(bookingId)
                .filter(b -> b.getCustomer().equals(user.getCustomer()))
                .map(this::mapToDetailDTO)
                .orElse(null);
    }

    @Override
    public boolean cancelBooking(String username, Integer bookingId) {
        AppUser user = userRepository.findByUserName(username).orElse(null);
        if (user == null || user.getCustomer() == null) return false;

        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) return false;

        Booking booking = bookingOpt.get();
        if (!booking.getCustomer().equals(user.getCustomer())) return false;

        // chỉ cho phép hủy khi đang PENDING
        if (booking.getStatus() != BookingStatus.PENDING) {
            return false;
        }

        booking.setStatus(BookingStatus.CANCELED);
        bookingRepository.save(booking);
        return true;
    }

    /**
     * Mapping Booking -> BookingDetailDTO
     */
    private BookingDetailDTO mapToDetailDTO(Booking b) {
        Payment payment = getFirstPayment(b);

        return new BookingDetailDTO(
                b.getBookingId(),
                b.getCar().getCarName(),
                b.getCar().getBrand().getBrandName(),
                b.getCar().getCarType().getTypeName(),
                b.getPickupDate().atTime(b.getPickupTime()),
                b.getReturnDate().atTime(b.getReturnTime()),
                b.getStatus(),
                mapStatusLabel(b.getStatus()),
                payment != null ? payment.getPaymentMethod() : null,  // Enum PaymentMethod
                b.getTotalAmount(), // tổng tiền booking
                b.getCustomer().getCustomerName(),
                b.getCustomer().getCustomerPhone()
        );
    }


    /**
     * Mapping Booking -> BookingHistoryDTO
     */
    private BookingHistoryDTO mapToHistoryDTO(Booking b) {
        Payment payment = getFirstPayment(b);

        return new BookingHistoryDTO(
                b.getBookingId(),
                b.getCar().getCarName(),
                b.getPickupDate().atTime(b.getPickupTime()),
                b.getReturnDate().atTime(b.getReturnTime()),
                b.getStatus(), // Enum gốc
                mapStatusLabel(b.getStatus()), // label string đẹp
                payment != null ? payment.getPaymentMethod() : null,  // Enum PaymentMethod
                payment != null ? payment.getAmount() : 0.0
        );
    }

    /**
     * Lấy payment đầu tiên trong list (nếu có)
     */
    private Payment getFirstPayment(Booking booking) {
        if (booking.getPayments() != null && !booking.getPayments().isEmpty()) {
            return booking.getPayments().get(0);
        }
        return null;
    }

    /**
     * Map BookingStatus -> label tiếng Việt
     */
    private String mapStatusLabel(BookingStatus status) {
        return switch (status) {
            case PENDING -> "Chờ xác nhận";
            case CONFIRMED -> "Đã xác nhận";
            case CANCELED -> "Đã hủy";
            case COMPLETED -> "Hoàn thành";
        };
    }
}
