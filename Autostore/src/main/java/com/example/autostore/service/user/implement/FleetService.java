package com.example.autostore.service.user.implement;

import com.example.autostore.Enum.CarStatus;
import com.example.autostore.dto.admin.CarLocationDTO;
import com.example.autostore.dto.admin.FleetCarDTO;
import com.example.autostore.dto.admin.FleetOverviewDTO;
import com.example.autostore.model.Car;
import com.example.autostore.repository.ICarRepository;
import com.example.autostore.service.user.interfaces.IFleetService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FleetService implements IFleetService {
    private final ICarRepository carRepository;

    public FleetService(ICarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public FleetOverviewDTO getOverview() {
        List<Car> cars = carRepository.findAll();

        long totalCars = cars.size();
        long rentedCars = cars.stream().filter(c -> c.getStatus() == CarStatus.RENTED).count();
        long maintenanceCars = cars.stream().filter(c -> c.getStatus() == CarStatus.MAINTENANCE).count();

        double utilization = totalCars > 0 ? (double) rentedCars / totalCars * 100 : 0;

        return new FleetOverviewDTO(totalCars, rentedCars, maintenanceCars, utilization);
    }

    @Override
    public List<FleetCarDTO> getAllCars() {
        return carRepository.findAll().stream()
                .map(c -> new FleetCarDTO(
                        c.getCarId(),
                        c.getCarName(),
                        c.getImageUrl(),
                        c.getLocation(),
                        c.getStatus()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<CarLocationDTO> getCarLocations() {
        return carRepository.findAll().stream()
                .map(c -> new CarLocationDTO(
                        c.getCarId(),
                        c.getCarName(),
                        c.getStatus().name(),
                        c.getLatitude(),
                        c.getLongitude(),
                        c.getImageUrl()   // thêm ảnh xe
                ))
                .collect(Collectors.toList());
    }

    @Override
    public CarLocationDTO updateCarLocation(Integer carId, double latitude, double longitude) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found: " + carId));

        car.setLatitude(latitude);
        car.setLongitude(longitude);
        carRepository.save(car);

        return new CarLocationDTO(
                car.getCarId(),
                car.getCarName(),
                car.getStatus().name(),
                car.getLatitude(),
                car.getLongitude(),
                car.getImageUrl()
        );
    }
}
