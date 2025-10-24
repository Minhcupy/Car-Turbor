package com.example.autostore.repository;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IBookingRepository extends JpaRepository<Booking, Integer> {
    // Lọc theo trạng thái (PENDING, CONFIRMED, ...)
    List<Booking> findByStatus(BookingStatus status);


    // Lọc theo ID xe
    List<Booking> findByCar_CarId(Integer carId);


    Page<Booking> findByCustomer_CustomerNameContainingIgnoreCaseOrCar_CarNameContainingIgnoreCase(
            String customerName, String carName, Pageable pageable
    );
    @Query(value = """
        WITH RECURSIVE date_series AS (
            SELECT :startDate AS dayKey
            UNION ALL
            SELECT DATE_ADD(dayKey, INTERVAL 1 DAY)
            FROM date_series
            WHERE dayKey < :endDate
        )
        SELECT ds.dayKey,
               COALESCE(COUNT(b.bookingId), 0) AS bookingCount
        FROM date_series ds
        LEFT JOIN Booking b
               ON DATE(b.createdAt) = ds.dayKey
              AND b.status = 'CONFIRMED'
        LEFT JOIN Car c ON b.carId = c.carId
        LEFT JOIN Brand br ON c.brandId = br.brandId
        LEFT JOIN CarType ct ON c.carTypeId = ct.carTypeId
        WHERE (:Brand IS NULL OR LOWER(br.brandName) = LOWER(:brand))
          AND (:CarType IS NULL OR LOWER(ct.typeName) = LOWER(:carType))
        GROUP BY ds.dayKey
        ORDER BY ds.dayKey
        """, nativeQuery = true)
    List<Object[]> getDailyBookingsWithZeros(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("brand") String brand,
            @Param("carType") String carType
    );

    // Step 2: Kiểm tra xe có bị trùng lịch không
    @Query("""
        SELECT b FROM Booking b
        WHERE b.car.carId = :carId
          AND b.status IN ('PENDING', 'CONFIRMED')
          AND (
              (b.pickupDate BETWEEN :pickupDate AND :returnDate)
              OR (b.returnDate BETWEEN :pickupDate AND :returnDate)
              OR (:pickupDate BETWEEN b.pickupDate AND b.returnDate)
              OR (:returnDate BETWEEN b.pickupDate AND b.returnDate)
          )
    """)
    List<Booking> checkCarAvailability(
            @Param("carId") Integer carId,
            @Param("pickupDate") LocalDate pickupDate,
            @Param("returnDate") LocalDate returnDate
    );
    // Step 4: Lấy danh sách booking theo khách hàng
    List<Booking> findByCustomer_CustomerId(Integer customerId);

    List<Booking> findByCustomer_CustomerIdAndStatus(Integer customerId, BookingStatus status);

    List<Booking> findByCustomer(Customer customer);
    // ✅ Đếm tổng số booking
    @Query("SELECT COUNT(b) FROM Booking b")
    long countBookings();

    // ✅ Đếm số booking hôm nay
    @Query("SELECT COUNT(b) FROM Booking b WHERE DATE(b.createdAt) = CURRENT_DATE")
    long countBookingsToday();

    // ✅ Đếm số booking trong tháng hiện tại
    @Query("SELECT COUNT(b) FROM Booking b WHERE MONTH(b.createdAt) = MONTH(CURRENT_DATE) AND YEAR(b.createdAt) = YEAR(CURRENT_DATE)")
    long countBookingsThisMonth();

    // ✅ Đếm số booking đang pending
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'PENDING'")
    long countPendingBookings();

    // ✅ Tính tỉ lệ hủy (cancel rate)
    @Query("SELECT (COUNT(CASE WHEN b.status = 'CANCELED' THEN 1 END) * 1.0 / COUNT(b)) * 100 FROM Booking b")
    Double calcCancelRate();

    // ✅ Lấy 5 booking mới nhất
    @Query("SELECT b FROM Booking b JOIN FETCH b.customer JOIN FETCH b.car ORDER BY b.createdAt DESC")
    List<Booking> findRecentBookings(Pageable pageable);

}