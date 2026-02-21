package com.example.autostore.service.admin.implement;

import com.example.autostore.dto.admin.*;
import com.example.autostore.repository.*;
import com.example.autostore.service.ContractContentService;
import com.example.autostore.service.admin.interfaces.IDashboardAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardAdminService implements IDashboardAdminService {

    private final ICarRepository carRepository;
    private final ICustomerRepository customerRepository;
    private final IBookingRepository bookingRepository;
    private final IPaymentRepository paymentRepository;
    private final ContractContentService contractContentService;


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

    @Override
    public DashboardReportDTO getDashboardReport(LocalDate startDate,
                                                 LocalDate endDate,
                                                 String brand,
                                                 String carType) {

        if (startDate == null) startDate = LocalDate.now().minusDays(30);
        if (endDate == null) endDate = LocalDate.now();

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        // Formatters
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        DateTimeFormatter dayFmt = DateTimeFormatter.ofPattern("dd/MM");

        // Doanh thu theo tháng
        List<RevenuePointDTO> monthlyRevenue = paymentRepository.getMonthlyRevenue(start, end, brand, carType)
                .stream()
                .map(r -> new RevenuePointDTO(
                        YearMonth.parse(String.valueOf(r[0]), DateTimeFormatter.ofPattern("yyyy-MM"))
                                .format(monthFmt),
                        r[1] == null ? 0.0 : ((Number) r[1]).doubleValue()
                ))
                .toList();

        // Brand ratio
        List<BrandRatioDTO> brandRatio = carRepository.getBrandRatio(carType)
                .stream()
                .map(r -> new BrandRatioDTO(
                        String.valueOf(r[0]).toUpperCase(),
                        r[1] == null ? 0L : ((Number) r[1]).longValue()
                ))
                .toList();

        // Daily bookings (fill ngày trống = 0)
        List<BookingPointDTO> dailyBookings = bookingRepository.getDailyBookingsWithZeros(start, end, brand, carType)
                .stream()
                .map(r -> new BookingPointDTO(
                        ((java.sql.Date) r[0]).toLocalDate().format(dayFmt),
                        r[1] == null ? 0L : ((Number) r[1]).longValue()
                ))
                .toList();

        return new DashboardReportDTO(monthlyRevenue, brandRatio, dailyBookings);
    }

    public byte[] exportReportPdf(LocalDate startDate, LocalDate endDate, String brand, String carType) {
        DashboardReportDTO report = getDashboardReport(startDate, endDate, brand, carType);
        String html = contractContentService.buildReportHtml(report, startDate, endDate, brand, carType);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            var builder = new com.openhtmltopdf.pdfboxout.PdfRendererBuilder();
            builder.useFastMode();

            // ✅ Embed DejaVu fonts (support Vietnamese)
            InputStream regular = getClass().getResourceAsStream("/fonts/DejaVuSans.ttf");
            InputStream bold = getClass().getResourceAsStream("/fonts/DejaVuSans-Bold.ttf");

            if (regular == null || bold == null) {
                throw new IllegalStateException("Missing fonts in /resources/fonts (DejaVuSans.ttf, DejaVuSans-Bold.ttf)");
            }

            builder.useFont(() -> regular, "DejaVu Sans");
            builder.useFont(() -> bold, "DejaVu Sans Bold");

            builder.withHtmlContent(html, null);
            builder.toStream(out);
            builder.run();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("EXPORT_PDF_FAILED", e);
        }
    }
}
