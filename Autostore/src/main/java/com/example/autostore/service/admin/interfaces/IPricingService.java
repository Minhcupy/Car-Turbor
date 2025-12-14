package com.example.autostore.service.admin.interfaces;

import com.example.autostore.dto.admin.PricingDTO;

import java.util.List;

public interface IPricingService {

    List<PricingDTO> getPricingByCar(Integer carId);

    PricingDTO createPricing(PricingDTO dto);

    PricingDTO updatePricing(Integer pricingId, PricingDTO dto);

    void deletePricing(Integer pricingId);
}
