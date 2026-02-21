package com.example.autostore.controller.admin;

import com.example.autostore.dto.admin.*;
import com.example.autostore.service.admin.implement.DashboardAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:3000") // FE React/Next.js
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardAdminService dashboardService;

    // 📊 Thống kê tổng quan (Stats Cards)
    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        return dashboardService.getStats();
    }

//    // 📈 Doanh thu 12 tháng gần nhất
//    @GetMapping("/charts/revenue")
//    public List<RevenueChartDTO> getRevenueTrend() {
//        return dashboardService.getRevenueTrend();
//    }
//
//    // 📈 Số booking theo ngày (30 ngày gần nhất)
//    @GetMapping("/charts/daily-bookings")
//    public List<DailyBookingsDTO> getDailyBookings() {
//        return dashboardService.getDailyBookings();
//    }
//
//    // 🚘 Fleet by Brand (Pie Chart)
//    @GetMapping("/charts/brands")
//    public List<RatioDTO> getFleetByBrand() {
//        return dashboardService.getFleetByBrand();
//    }
//
//    // 🚘 Fleet by Type (Pie Chart)
//    @GetMapping("/charts/types")
//    public List<RatioDTO> getFleetByType() {
//        return dashboardService.getFleetByType();
//    }
//
//    // 📋 5 booking mới nhất
//    @GetMapping("/recent/bookings")
//    public List<RecentBookingDTO> getRecentBookings() {
//        return dashboardService.getRecentBookings();
//    }
//
//    // 👥 5 khách hàng mới nhất
//    @GetMapping("/recent/customers")
//    public List<RecentCustomerDTO> getRecentCustomers() {
//        return dashboardService.getRecentCustomers();
//    }

    @GetMapping("/report")
    public DashboardReportDTO getReport(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String carType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if ("all".equalsIgnoreCase(brand)) brand = null;
        if ("all".equalsIgnoreCase(carType)) carType = null;

        return dashboardService.getDashboardReport(startDate, endDate, brand, carType);
    }

    @GetMapping(value = "/report/pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> exportReportPdf(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String carType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if ("all".equalsIgnoreCase(brand)) brand = null;
        if ("all".equalsIgnoreCase(carType)) carType = null;

        byte[] pdf = dashboardService.exportReportPdf(startDate, endDate, brand, carType);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=dashboard-report.pdf")
                .body(pdf);
    }
}
