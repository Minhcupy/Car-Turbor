package com.example.autostore.service.admin.interfaces;

import com.example.autostore.dto.admin.BrandDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IBrandService {
    List<BrandDTO> findAll();
    BrandDTO findById(Integer brandId);
    BrandDTO create(BrandDTO dto);
    BrandDTO update(Integer brandId, BrandDTO dto);
    void delete(Integer brandId);
    Page<BrandDTO> findByKeyword(String keyword, int page, int pageSize);
}
