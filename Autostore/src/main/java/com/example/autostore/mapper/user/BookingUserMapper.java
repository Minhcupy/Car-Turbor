package com.example.autostore.mapper.user;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.dto.user.BookingRequestDTO;
import com.example.autostore.dto.user.BookingResponseDTO;
import com.example.autostore.dto.user.BookingPreviewDTO;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Car;
import com.example.autostore.model.Customer;
import com.example.autostore.model.Pricing;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class BookingUserMapper {

    /**
     * Map từ Request DTO → Entity Booking
     * ✅ Tính tiền theo Pricing + rentalUnits
     */
    public Booking toEntity(BookingRequestDTO dto, Car car, Customer customer, Pricing pricing) {
        Booking booking = new Booking();
        booking.setCar(car);
        booking.setCustomer(customer);

        booking.setPickupLocation(dto.getPickupLocation());
        booking.setReturnLocation(dto.getReturnLocation());
        booking.setPickupDate(dto.getPickupDate());
        booking.setReturnDate(dto.getReturnDate());
        booking.setPickupTime(dto.getPickupTime());
        booking.setReturnTime(dto.getReturnTime());
        booking.setNotes(dto.getNotes());

        // ✅ pricing + rentalUnits
        booking.setPricing(pricing);

        Integer units = dto.getRentalUnits();
        if (units == null || units <= 0) units = 1;
        booking.setRentalUnits(units);

        // ✅ giá theo pricing
        BigDecimal priceBD = pricing.getPrice(); // BigDecimal
        if (priceBD == null) throw new RuntimeException("Pricing chưa có giá");

        double pricePerUnit = priceBD.doubleValue();
        double totalAmount = units * pricePerUnit;
        double depositAmount = totalAmount * 0.3;

        booking.setTotalAmount(totalAmount);
        booking.setDepositAmount(depositAmount);
        booking.setStatus(BookingStatus.PENDING);

        return booking;
    }

    /**
     * Map từ Booking Entity → Response DTO
     * ✅ Trả thêm pricing + rentalUnits cho FE nếu cần
     */
    public BookingResponseDTO toResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setStatus(booking.getStatus().name());

        // Xe
        dto.setCarId(booking.getCar().getCarId());
        dto.setCarName(booking.getCar().getCarName());
        dto.setCarImage(booking.getCar().getImageUrl());

        // ✅ price hiển thị: lấy theo pricing (nếu có), fallback dailyPrice
        if (booking.getPricing() != null && booking.getPricing().getPrice() != null) {
            dto.setPrice(booking.getPricing().getPrice().doubleValue());
        } else {
            dto.setPrice(booking.getCar().getDailyPrice());
        }

        // Thông tin thuê
        dto.setPickupLocation(booking.getPickupLocation());
        dto.setReturnLocation(booking.getReturnLocation());
        dto.setPickupDate(booking.getPickupDate());
        dto.setReturnDate(booking.getReturnDate());
        dto.setPickupTime(booking.getPickupTime());
        dto.setReturnTime(booking.getReturnTime());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setDepositAmount(booking.getDepositAmount());

        // Khách hàng
        dto.setCustomerName(booking.getCustomer().getCustomerName());
        dto.setCustomerPhone(booking.getCustomer().getCustomerPhone());
        dto.setCustomerEmail(booking.getCustomer().getCustomerEmail());

        if (booking.getPayments() != null && !booking.getPayments().isEmpty()) {
            dto.setPaymentId(booking.getPayments().get(0).getPaymentId());
        }

        return dto;
    }

    /**
     * Map từ Request + Pricing → Preview DTO
     * ✅ Preview theo pricing + rentalUnits
     */
    public BookingPreviewDTO toPreviewDTO(BookingRequestDTO dto, Pricing pricing) {
        Integer units = dto.getRentalUnits();
        if (units == null || units <= 0) units = 1;

        BigDecimal priceBD = pricing.getPrice();
        if (priceBD == null) throw new RuntimeException("Pricing chưa có giá");

        double pricePerUnit = priceBD.doubleValue();
        double totalAmount = units * pricePerUnit;
        double depositAmount = totalAmount * 0.3;

        BookingPreviewDTO preview = new BookingPreviewDTO();

        // ✅ bạn có thể đổi tên field preview (rentalDays/dailyPrice) cho đúng nghĩa
        // tạm thời vẫn set để UI không vỡ:
        preview.setRentalDays(units);          // (tạm) units
        preview.setDailyPrice(pricePerUnit);   // (tạm) pricePerUnit

        preview.setTotalAmount(totalAmount);
        preview.setDepositAmount(depositAmount);

        return preview;
    }
}
