package com.example.autostore.service.user.implement;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.Enum.CarStatus;
import com.example.autostore.dto.CarSearchRequest;
import com.example.autostore.dto.user.CarUserDTO;
import com.example.autostore.model.Car;
import com.example.autostore.model.CarImage;
import com.example.autostore.repository.IBookingRepository;
import com.example.autostore.repository.ICarRepository;
import com.example.autostore.service.user.interfaces.ICarUserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarUserService implements ICarUserService {
    private final ICarRepository carRepository;
    private final IBookingRepository bookingRepository;

    public CarUserService(ICarRepository carRepository, IBookingRepository bookingRepository) {
        this.carRepository = carRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<CarUserDTO> getAllCars() {
        return carRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CarUserDTO getCarById(Integer id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id " + id));
        return mapToDTO(car);
    }

    @Override
    public List<CarUserDTO> searchCars(CarSearchRequest req) {
        // ✅ validate basic time range
        if (req.getPickupDate() == null || req.getReturnDate() == null ||
                req.getPickupTime() == null || req.getReturnTime() == null) {
            throw new RuntimeException("Thiếu thông tin thời gian nhận/trả");
        }

        LocalDateTime startDT = LocalDateTime.of(req.getPickupDate(), req.getPickupTime());
        LocalDateTime endDT = LocalDateTime.of(req.getReturnDate(), req.getReturnTime());

        if (!endDT.isAfter(startDT)) {
            throw new RuntimeException("Thời gian trả phải sau thời gian nhận");
        }

        // ✅ xe bận trong khoảng thời gian (PENDING, CONFIRMED)
        List<Integer> busyCarIds = bookingRepository.findBusyCarIds(
                startDT,
                endDT,
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );

        // ✅ tìm xe AVAILABLE và loại trừ xe bận
        List<Car> cars = carRepository.searchAvailableCars(
                req.getPickupLocation(),
                req.getKeyword(),
                req.getFuelType(),
                req.getSeats(),
                busyCarIds,
                busyCarIds == null || busyCarIds.isEmpty()
        );

        return cars.stream().map(this::mapToDTO).collect(Collectors.toList());
    }


    private CarUserDTO mapToDTO(Car car) {
        CarUserDTO dto = new CarUserDTO();
        dto.setCarId(car.getCarId());
        dto.setCarName(car.getCarName());
        dto.setImageUrl(car.getImageUrl());

        // Gallery
        dto.setGallery(car.getCarImages() != null
                ? car.getCarImages().stream().map(CarImage::getImagePath).collect(Collectors.toList())
                : List.of());

        dto.setBrandName(car.getBrand() != null ? car.getBrand().getBrandName() : null);
        dto.setTypeName(car.getCarType() != null ? car.getCarType().getTypeName() : null);

        // Giá theo ngày
        if (car.getPricing() != null && !car.getPricing().isEmpty()) {
            car.getPricing().stream()
                    .filter(p -> "day".equalsIgnoreCase(p.getUnit()))
                    .findFirst()
                    .ifPresent(p -> dto.setPrice(p.getPrice().doubleValue()));
        }

        // Status
        dto.setStatus(car.getStatus() != null ? car.getStatus() : CarStatus.AVAILABLE);

        // CarDetail
        if (car.getCarDetail() != null) {
            dto.setEngine(car.getCarDetail().getEngine());
            dto.setFuelType(car.getCarDetail().getFuelType());
            dto.setSeats(car.getCarDetail().getSeatCount());
            dto.setTransmission(car.getCarDetail().getTransmission());
            dto.setYear(car.getCarDetail().getYear());
            dto.setColor(car.getCarDetail().getColor());
            dto.setLicensePlate(car.getCarDetail().getLicensePlate());
            dto.setDescription(car.getCarDetail().getDescription());
        }

        // Car info
        dto.setLocation(car.getLocation());
        dto.setCreatedDate(car.getCreatedDate());
        dto.setLatitude(car.getLatitude());
        dto.setLongitude(car.getLongitude());
        dto.setFeatured(car.isFeatured());

        // TODO: mapping rating sau nếu có bảng Review
        dto.setRating(0);

        return dto;
    }
}
