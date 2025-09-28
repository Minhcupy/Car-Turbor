package com.example.autostore.mapper.user;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.dto.user.BookingRequestDTO;
import com.example.autostore.dto.user.BookingResponseDTO;
import com.example.autostore.dto.user.BookingPreviewDTO;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Car;
import com.example.autostore.model.Customer;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class BookingUserMapper {

    /**
     * Map từ Request DTO → Entity Booking
     */
    public Booking toEntity(BookingRequestDTO dto, Car car, Customer customer) {
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

        // Tính toán số ngày thuê
        long days = ChronoUnit.DAYS.between(dto.getPickupDate(), dto.getReturnDate());
        if (days <= 0) days = 1;

        Double price = car.getDailyPrice(); // giá thuê/ngày
        if (price == null) {
            throw new RuntimeException("Xe chưa có giá thuê theo ngày");
        }

        double totalAmount = days * price;
        double depositAmount = totalAmount * 0.3;

        booking.setTotalAmount(totalAmount);
        booking.setDepositAmount(depositAmount);
        booking.setStatus(BookingStatus.PENDING);

        return booking;
    }

    /**
     * Map từ Booking Entity → Response DTO
     */
    public BookingResponseDTO toResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setStatus(booking.getStatus().name());

        // Xe
        dto.setCarId(booking.getCar().getCarId());
        dto.setCarName(booking.getCar().getCarName());
        dto.setCarImage(booking.getCar().getImageUrl());
        dto.setPrice(booking.getCar().getDailyPrice()); // map price vào DTO

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

        return dto;
    }

    /**
     * Map từ Request + Car → Preview DTO
     */
    public BookingPreviewDTO toPreviewDTO(BookingRequestDTO dto, Car car) {
        long days = ChronoUnit.DAYS.between(dto.getPickupDate(), dto.getReturnDate());
        if (days <= 0) days = 1;

        Double price = car.getDailyPrice(); // giá thuê/ngày
        if (price == null) {
            throw new RuntimeException("Xe chưa có giá thuê theo ngày");
        }

        double totalAmount = days * price;
        double depositAmount = totalAmount * 0.3;

        BookingPreviewDTO preview = new BookingPreviewDTO();
        preview.setRentalDays((int) days);
        preview.setDailyPrice(price);
        preview.setTotalAmount(totalAmount);
        preview.setDepositAmount(depositAmount);

        return preview;
    }
}
