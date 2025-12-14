package com.example.autostore.service.admin.implement;

import com.example.autostore.dto.admin.PricingDTO;
import com.example.autostore.model.Car;
import com.example.autostore.model.Pricing;
import com.example.autostore.repository.ICarRepository;
import com.example.autostore.repository.PricingRepository;
import com.example.autostore.service.admin.interfaces.IPricingService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PricingServiceImpl implements IPricingService {

    private final PricingRepository pricingRepo;
    private final ICarRepository carRepo;

    public PricingServiceImpl(PricingRepository pricingRepo, ICarRepository carRepo) {
        this.pricingRepo = pricingRepo;
        this.carRepo = carRepo;
    }

    @Override
    public List<PricingDTO> getPricingByCar(Integer carId) {
        List<Pricing> list = pricingRepo.findByCar_CarId(carId);
        return list.stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public PricingDTO createPricing(PricingDTO dto) {
        // Tìm car
        Car car = carRepo.findById(dto.getCarId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe với id = " + dto.getCarId()));

        Pricing pricing = new Pricing();
        pricing.setUnit(dto.getUnit());
        pricing.setPrice(dto.getPrice());
        pricing.setCar(car);

        Pricing saved = pricingRepo.save(pricing);

        // Option: thêm vào list pricing của car (nếu cần)
        // car.getPricing().add(saved);

        return toDTO(saved);
    }

    @Override
    public PricingDTO updatePricing(Integer pricingId, PricingDTO dto) {
        Pricing pricing = pricingRepo.findById(pricingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy pricing với id = " + pricingId));

        pricing.setUnit(dto.getUnit());
        pricing.setPrice(dto.getPrice());

        // Nếu cho phép đổi sang xe khác:
        if (dto.getCarId() != null && !dto.getCarId().equals(pricing.getCar().getCarId())) {
            Car newCar = carRepo.findById(dto.getCarId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe với id = " + dto.getCarId()));
            pricing.setCar(newCar);
        }

        Pricing saved = pricingRepo.save(pricing);
        return toDTO(saved);
    }

    @Override
    public void deletePricing(Integer pricingId) {
        if (!pricingRepo.existsById(pricingId)) {
            throw new IllegalArgumentException("Không tìm thấy pricing với id = " + pricingId);
        }
        pricingRepo.deleteById(pricingId);
    }

    // ===== Helper mapping =====
    private PricingDTO toDTO(Pricing p) {
        return new PricingDTO(
                p.getPricingId(),
                p.getUnit(),
                p.getPrice(),
                p.getCar() != null ? p.getCar().getCarId() : null
        );
    }
}
