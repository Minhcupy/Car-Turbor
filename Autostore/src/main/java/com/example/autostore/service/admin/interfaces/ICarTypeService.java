package com.example.autostore.service.admin.interfaces;

import com.example.autostore.dto.admin.CarTypeDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICarTypeService {
    List<CarTypeDTO> findAll();
    CarTypeDTO findById(Integer carTypeId);
    CarTypeDTO create(CarTypeDTO dto);
    CarTypeDTO update(Integer carTypeId, CarTypeDTO dto);
    void delete(Integer carTypeId);
    Page<CarTypeDTO> findByKeyword(String keyword, int page, int pageSize);
}
