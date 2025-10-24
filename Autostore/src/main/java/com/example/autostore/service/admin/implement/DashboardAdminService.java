package com.example.autostore.service.admin.implement;

import com.example.autostore.dto.admin.*;
import com.example.autostore.repository.*;
import com.example.autostore.service.admin.interfaces.IDashboardAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardAdminService implements IDashboardAdminService {

    private final ICarRepository carRepository;
    private final ICustomerRepository customerRepository;
    private final IBookingRepository bookingRepository;
    private final IPaymentRepository paymentRepository;



    // 📊 Stats Cards
    public DashboardStatsDTO getStats() {
        return new DashboardStatsDTO(
                carRepository.count(),  // Tổng số xe
                bookingRepository.countBookingsToday(),  // Booking hôm nay
                bookingRepository.countBookingsThisMonth(), // Booking tháng này
                Optional.ofNullable(paymentRepository.sumRevenueThisMonth()).orElse(0.0), // Doanh thu
                customerRepository.countNewCustomersThisMonth(), // Khách mới tháng này
                bookingRepository.countPendingBookings(), // Booking đang chờ
                Optional.ofNullable(bookingRepository.calcCancelRate()).orElse(0.0) // Cancel Rate
        );
    }


}
