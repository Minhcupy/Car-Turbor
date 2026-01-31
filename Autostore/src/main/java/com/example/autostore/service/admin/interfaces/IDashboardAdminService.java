package com.example.autostore.service.admin.interfaces;

import com.example.autostore.dto.admin.*;

import java.time.LocalDate;
import java.util.List;

public interface IDashboardAdminService {
    DashboardStatsDTO getStats();

    DashboardReportDTO getDashboardReport(LocalDate startDate,
                                          LocalDate endDate,
                                          String brand,
                                          String carType);
//    List<RevenueChartDTO> getRevenueTrend();
//    List<DailyBookingsDTO> getDailyBookings();
//    List<RatioDTO> getFleetByBrand();
//    List<RatioDTO> getFleetByType();
//    List<RecentBookingDTO> getRecentBookings();
//    List<RecentCustomerDTO> getRecentCustomers();
}
