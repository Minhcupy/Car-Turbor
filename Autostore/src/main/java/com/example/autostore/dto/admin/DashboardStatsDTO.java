package com.example.autostore.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalCars;
    private long bookingsToday;
    private long bookingsThisMonth;
    private double revenueThisMonth;
    private long newCustomers;
    private long pendingBookings;
    private double cancelRate;
}