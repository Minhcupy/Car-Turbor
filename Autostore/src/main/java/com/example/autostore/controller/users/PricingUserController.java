package com.example.autostore.controller.users;

import com.example.autostore.dto.admin.PricingDTO;
import com.example.autostore.service.admin.interfaces.IPricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
@CrossOrigin(origins = "*")
public class PricingUserController {
    private final IPricingService pricingService;

    public PricingUserController(IPricingService pricingService) {
        this.pricingService = pricingService;
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<PricingDTO>> getPricingByCar(@PathVariable Integer carId) {
        return ResponseEntity.ok(pricingService.getPricingByCar(carId));
    }
}
