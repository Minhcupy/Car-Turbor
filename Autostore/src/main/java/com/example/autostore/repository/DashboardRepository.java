package com.example.autostore.repository;

import com.example.autostore.model.Booking;
import com.example.autostore.model.Customer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardRepository extends JpaRepository<Booking, Integer> {

    @Query("SELECT COUNT(c) FROM Car c")
    long countCars();

    @Query("SELECT COUNT(b) FROM Booking b WHERE DATE(b.createdAt) = CURRENT_DATE")
    long countBookingsToday();

    @Query("SELECT COUNT(b) FROM Booking b WHERE MONTH(b.createdAt) = MONTH(CURRENT_DATE) AND YEAR(b.createdAt) = YEAR(CURRENT_DATE)")
    long countBookingsThisMonth();

    // Doanh thu tháng hiện tại
    @Query("SELECT SUM(p.amount) FROM Payment p " +
            "WHERE MONTH(p.paymentDate) = MONTH(CURRENT_DATE) " +
            "AND YEAR(p.paymentDate) = YEAR(CURRENT_DATE) " +
            "AND p.status = com.example.autostore.Enum.PaymentStatus.SUCCESS")
    Double sumRevenueThisMonth();

    @Query("SELECT COUNT(c) FROM Customer c WHERE MONTH(c.createdAt) = MONTH(CURRENT_DATE) AND YEAR(c.createdAt) = YEAR(CURRENT_DATE)")
    long countNewCustomers();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = com.example.autostore.Enum.BookingStatus.PENDING")
    long countPendingBookings();

    @Query("SELECT (COUNT(CASE WHEN b.status = com.example.autostore.Enum.BookingStatus.CANCELED THEN 1 END) * 1.0 / COUNT(b)) * 100 FROM Booking b")
    Double calcCancelRate();

    // Revenue trend (12 tháng gần nhất)
    @Query(value = "SELECT DATE_FORMAT(p.payment_date, '%Y-%m') as month, SUM(p.amount) as revenue " +
            "FROM payment p WHERE p.status='SUCCESS' " +
            "GROUP BY month ORDER BY month DESC LIMIT 12", nativeQuery = true)
    List<Object[]> revenueTrend();

    // Daily bookings (30 ngày gần đây)
    @Query(value = "SELECT DATE(b.created_at) as day, COUNT(*) as bookings " +
            "FROM booking b " +
            "GROUP BY day ORDER BY day DESC LIMIT 30", nativeQuery = true)
    List<Object[]> dailyBookings();

    // Fleet by brand
    @Query(value = "SELECT br.brand_name, COUNT(*) FROM car c JOIN brand br ON c.brand_id=br.brand_id GROUP BY br.brand_name", nativeQuery = true)
    List<Object[]> fleetByBrand();

    // Fleet by type
    @Query(value = "SELECT ct.type_name, COUNT(*) FROM car c JOIN car_type ct ON c.type_id=ct.type_id GROUP BY ct.type_name", nativeQuery = true)
    List<Object[]> fleetByType();

    // Recent bookings
    @Query("SELECT b FROM Booking b JOIN FETCH b.customer JOIN FETCH b.car ORDER BY b.createdAt DESC")
    List<Booking> recentBookings(Pageable pageable);

    // Recent customers
    @Query("SELECT c FROM Customer c ORDER BY c.createdAt DESC")
    List<Customer> recentCustomers(Pageable pageable);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.customer.customerId = :customerId")
    long countBookingsByCustomer(@Param("customerId") Integer customerId);
}
