package com.example.autostore.service.admin.interfaces;

import com.example.autostore.dto.admin.DashboardReportDTO;

import java.time.LocalDate;

public interface IDashboardService {
    DashboardReportDTO getDashboardReport(LocalDate startDate, LocalDate endDate, String brand, String carType);
}
