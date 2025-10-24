package com.example.autostore.repository;

import com.example.autostore.Enum.CarStatus;     // ĐÚNG package enum của bạn
import com.example.autostore.model.Car;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CarDataRepository extends JpaRepository<Car, Integer> {

    // Lọc xe AVAILABLE theo hãng (brandName) và số chỗ (seatCount)
    @Query("""
      SELECT c FROM Car c
      JOIN c.carDetail d
      JOIN c.brand b
      WHERE c.status = :status
        AND (:brandName IS NULL OR LOWER(b.brandName) = LOWER(:brandName))
        AND (:seatCount IS NULL OR d.seatCount = :seatCount)
    """)
    List<Car> findAvailableCars(
            @Param("status") CarStatus status,
            @Param("brandName") String brandName,
            @Param("seatCount") Integer seatCount
    );
}
