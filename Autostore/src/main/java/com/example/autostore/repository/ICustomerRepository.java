package com.example.autostore.repository;

import com.example.autostore.mapper.CustomerBookingProjection;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ICustomerRepository extends JpaRepository<Customer, Integer> {
    Page<Customer> findByCustomerNameContainingIgnoreCase(String keyword, Pageable pageable);
    Optional<Customer> findByCustomerEmail(String customerEmail);
    Optional<Customer> findByAppUser(AppUser appUser);

    @Query(value = "SELECT c.customer_id AS customerId, " +
            "c.customer_name AS customerName, " +
            "c.customer_email AS customerEmail, " +
            "c.customer_phone AS customerPhone, " +
            "c.customer_address AS customerAddress, " +
            "c.status AS status, " +
            "MAX(b.created_at) AS lastBookingDate, " +
            "COUNT(b.booking_id) AS totalBookings, " +
            "(SELECT car.car_name " +
            "   FROM booking b2 " +
            "   JOIN car car ON car.car_id = b2.car_id " +
            "   WHERE b2.customer_id = c.customer_id " +
            "   ORDER BY b2.created_at DESC LIMIT 1) AS lastCarName " +
            "FROM customers c " +
            "JOIN booking b ON b.customer_id = c.customer_id " +
            "WHERE (:keyword IS NULL OR LOWER(c.customer_name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(c.customer_email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(c.customer_phone) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "GROUP BY c.customer_id",
            countQuery = "SELECT COUNT(DISTINCT c.customer_id) " +
                    "FROM customers c JOIN booking b ON b.customer_id = c.customer_id " +
                    "WHERE (:keyword IS NULL OR LOWER(c.customer_name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "   OR LOWER(c.customer_email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "   OR LOWER(c.customer_phone) LIKE LOWER(CONCAT('%', :keyword, '%')))",
            nativeQuery = true)
    Page<CustomerBookingProjection> findCustomerBookingSummary(@Param("keyword") String keyword, Pageable pageable);


    // ✅ Đếm tổng số khách hàng
    @Query("SELECT COUNT(c) FROM Customer c")
    long countCustomers();

    // ✅ Đếm khách mới trong tháng này
    @Query("SELECT COUNT(c) FROM Customer c WHERE MONTH(c.createdAt) = MONTH(CURRENT_DATE) AND YEAR(c.createdAt) = YEAR(CURRENT_DATE)")
    long countNewCustomersThisMonth();
}
