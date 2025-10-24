package com.example.autostore.controller.admin;

import com.example.autostore.dto.admin.CarLocationDTO;
import com.example.autostore.dto.admin.FleetOverviewDTO;
import com.example.autostore.dto.admin.FleetCarDTO;
import com.example.autostore.service.user.interfaces.IFleetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fleet")
@CrossOrigin(origins = "*")
public class FleetController {

    private final IFleetService fleetService;

    public FleetController(IFleetService fleetService) {
        this.fleetService = fleetService;
    }

    // 🔹 Tổng quan đội xe
    @GetMapping("/overview")
    public FleetOverviewDTO getOverview() {
        return fleetService.getOverview();
    }

    // 🔹 Danh sách xe
    @GetMapping("/cars")
    public List<FleetCarDTO> getAllCars() {
        return fleetService.getAllCars();
    }

    // 🔹 Tracking map (có vị trí + ảnh)
    @GetMapping("/tracking")
    public List<CarLocationDTO> getTracking() {
        return fleetService.getCarLocations();
    }

    // 🔹 Cập nhật vị trí xe realtime
    @PutMapping("/cars/{id}/location")
    public CarLocationDTO updateCarLocation(
            @PathVariable Integer id,
            @RequestParam double latitude,
            @RequestParam double longitude
    ) {
        return fleetService.updateCarLocation(id, latitude, longitude);
    }
}
