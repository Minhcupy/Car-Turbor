package com.example.autostore.repository;

import com.example.autostore.model.ContractSignature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractSignatureRepository extends JpaRepository<ContractSignature, Integer> {
    List<ContractSignature> findByContract_Id(Integer contractId);
}
