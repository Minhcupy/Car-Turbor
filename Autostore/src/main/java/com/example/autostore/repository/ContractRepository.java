package com.example.autostore.repository;

import com.example.autostore.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    Optional<Contract> findByBooking_BookingId(Integer bookingId);
}
