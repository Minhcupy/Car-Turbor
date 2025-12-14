package com.example.autostore.service.admin.implement;

import com.example.autostore.Enum.CarStatus;
import com.example.autostore.dto.admin.CarRequestDTO;
import com.example.autostore.dto.admin.CarResponseDTO;
import com.example.autostore.dto.user.FeaturedCarDTO;
import com.example.autostore.exception.FileStorageException;
import com.example.autostore.mapper.CarMapper;
import com.example.autostore.model.*;
import com.example.autostore.repository.IBrandRepository;
import com.example.autostore.repository.ICarRepository;
import com.example.autostore.repository.ICarTypeRepository;
import com.example.autostore.service.FileUploadService;
import com.example.autostore.service.admin.interfaces.ICarService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CarServiceImpl implements ICarService {

    private final ICarRepository carRepo;
    private final IBrandRepository brandRepo;
    private final ICarTypeRepository carTypeRepo;
    private final FileUploadService fileUploadService;
    private final CarMapper carMapper;

    public CarServiceImpl(ICarRepository carRepo,
                          IBrandRepository brandRepo,
                          ICarTypeRepository carTypeRepo,
                          FileUploadService fileUploadService,
                          CarMapper carMapper) {
        this.carRepo = carRepo;
        this.brandRepo = brandRepo;
        this.carTypeRepo = carTypeRepo;
        this.fileUploadService = fileUploadService;
        this.carMapper = carMapper;
    }

    @Override
    public Page<CarResponseDTO> findByKeyword(String keyword, Integer carId, Integer page, Integer pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("createdDate").descending());
        return carRepo.findByKeyword(keyword, carId, pageable).map(carMapper::toDTO);
    }

    @Override
    public CarResponseDTO findById(Integer id) {
        return carRepo.findById(id).map(carMapper::toDTO).orElse(null);
    }

    @Override
    public CarResponseDTO createCar(CarRequestDTO dto) {
        // 1. Check brand & carType tồn tại
        Brand brand = brandRepo.findById(dto.getBrandId())
                .orElseThrow(() -> new IllegalArgumentException("Brand không tồn tại"));

        CarType carType = carTypeRepo.findById(dto.getCarTypeId())
                .orElseThrow(() -> new IllegalArgumentException("CarType không tồn tại"));

        // 2. Map DTO → Entity Car
        Car car = new Car();
        car.setCarName(dto.getCarName());
        car.setStatus(CarStatus.valueOf(dto.getStatus()));   // "AVAILABLE" | "RENTED" | ...
        car.setQuantity(dto.getQuantity());
        car.setLocation(dto.getLocation());
        car.setCreatedDate(java.time.LocalDateTime.now());
        car.setBrand(brand);
        car.setCarType(carType);

        // 3. CarDetail
        CarDetail detail = new CarDetail();
        detail.setEngine(dto.getEngine());
        detail.setFuelType(dto.getFuelType());
        detail.setSeatCount(dto.getSeatCount());
        detail.setYear(dto.getYear());
        detail.setColor(dto.getColor());
        detail.setLicensePlate(dto.getLicensePlate());
        detail.setCar(car);            // set 2 chiều
        car.setCarDetail(detail);

        // 4. Upload ảnh
        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            List<CarImage> images = dto.getImages().stream()
                    .filter(f -> !f.isEmpty())
                    .map(file -> {
                        String url = uploadFileSafe(file);   // dùng FileUploadService
                        CarImage img = new CarImage();
                        img.setImagePath(url);
                        img.setCar(car);
                        return img;
                    })
                    .collect(Collectors.toList());

            car.setCarImages(images);

            // Ảnh đầu tiên làm primary
            car.setImageUrl(images.get(0).getImagePath());
        }

        // 5. Lưu DB
        Car saved = carRepo.save(car);

        // 6. Trả DTO
        return carMapper.toDTO(saved);
    }

    @Override
    public CarResponseDTO updateCar(Integer id, CarRequestDTO dto) {
        // 1. Lấy car cũ
        Car car = carRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe với id = " + id));

        // 2. Check brand & carType
        Brand brand = brandRepo.findById(dto.getBrandId())
                .orElseThrow(() -> new IllegalArgumentException("Brand không tồn tại"));

        CarType carType = carTypeRepo.findById(dto.getCarTypeId())
                .orElseThrow(() -> new IllegalArgumentException("CarType không tồn tại"));

        // 3. Cập nhật field
        car.setCarName(dto.getCarName());
        car.setStatus(CarStatus.valueOf(dto.getStatus()));
        car.setQuantity(dto.getQuantity());
        car.setLocation(dto.getLocation());
        car.setBrand(brand);
        car.setCarType(carType);

        // 4. CarDetail
        CarDetail detail = car.getCarDetail();
        if (detail == null) {
            detail = new CarDetail();
            detail.setCar(car);
            car.setCarDetail(detail);
        }
        detail.setEngine(dto.getEngine());
        detail.setFuelType(dto.getFuelType());
        detail.setSeatCount(dto.getSeatCount());
        detail.setYear(dto.getYear());
        detail.setColor(dto.getColor());
        detail.setLicensePlate(dto.getLicensePlate());

        // 5. Nếu FE gửi ảnh mới thì clear ảnh cũ & upload lại
        if (dto.getImages() != null && !dto.getImages().isEmpty()
                && dto.getImages().stream().anyMatch(f -> !f.isEmpty())) {

            List<CarImage> carImages = car.getCarImages();
            carImages.clear(); // giờ là ArrayList nên clear OK

            for (MultipartFile file : dto.getImages()) {
                if (file.isEmpty()) continue;
                String url = uploadFileSafe(file);
                CarImage img = new CarImage();
                img.setImagePath(url);
                img.setCar(car);
                carImages.add(img);
            }

            if (!carImages.isEmpty()) {
                car.setImageUrl(carImages.get(0).getImagePath());
            }
        }

        Car saved = carRepo.save(car);
        return carMapper.toDTO(saved);
    }



    @Override
    public void deleteById(Integer id) {
        carRepo.deleteById(id);
    }

    @Override
    public List<FeaturedCarDTO> getFeaturedCars() {

        return carRepo.findFeaturedCars().stream().map(car -> {
            // Lấy giá theo ngày (unit = "DAY")
            Double price = car.getPricing().stream()
                    .filter(p -> "DAY".equalsIgnoreCase(p.getUnit()))
                    .map(Pricing::getPrice)
                    .map(BigDecimal::doubleValue)
                    .findFirst()
                    .orElse(0.0);

            return new FeaturedCarDTO(
                    car.getCarId(),
                    car.getCarName(),
                    car.getBrand().getBrandName(),
                    car.getImageUrl(),
                    price
            );
        }).toList();
    }


    // Helper method
    private String uploadFileSafe(MultipartFile file) {
        try {
            return fileUploadService.uploadFile(file);
        } catch (Exception e) {
            throw new FileStorageException("Upload failed: " + file.getOriginalFilename(), e);
        }
    }
}
