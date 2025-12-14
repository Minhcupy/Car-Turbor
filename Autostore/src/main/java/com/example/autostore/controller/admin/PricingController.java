package com.example.autostore.controller.admin;

import com.example.autostore.dto.admin.PricingDTO;
import com.example.autostore.service.admin.interfaces.IPricingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pricing")
@CrossOrigin(origins = "*")
public class PricingController {

    private final IPricingService pricingService;

    public PricingController(IPricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<PricingDTO>> getPricingByCar(@PathVariable Integer carId) {
        return ResponseEntity.ok(pricingService.getPricingByCar(carId));
    }

    @PostMapping
    public ResponseEntity<PricingDTO> createPricing(@Valid @RequestBody PricingDTO dto) {
        return ResponseEntity.ok(pricingService.createPricing(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PricingDTO> updatePricing(
            @PathVariable Integer id,
            @Valid @RequestBody PricingDTO dto
    ) {
        return ResponseEntity.ok(pricingService.updatePricing(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePricing(@PathVariable Integer id) {
        pricingService.deletePricing(id);
        return ResponseEntity.noContent().build();
    }
}
