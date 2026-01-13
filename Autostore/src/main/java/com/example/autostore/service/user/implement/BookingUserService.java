package com.example.autostore.service.user.implement;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.Enum.CarStatus;
import com.example.autostore.dto.user.*;
import com.example.autostore.mapper.user.BookingUserMapper;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Car;
import com.example.autostore.model.Customer;
import com.example.autostore.repository.*;
import com.example.autostore.service.user.interfaces.IBookingUserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingUserService implements IBookingUserService {
    private final IBookingRepository bookingRepository;
    private final ICarRepository carRepository;
    private final ICustomerRepository customerRepository;
    private final BookingUserMapper bookingMapper;
    private final UserRepository userRepository;

    public BookingUserService(
            IBookingRepository bookingRepository,
            ICarRepository carRepository,
            ICustomerRepository customerRepository,
            BookingUserMapper bookingMapper,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.customerRepository = customerRepository;
        this.bookingMapper = bookingMapper;
        this.userRepository = userRepository;
    }

    @Override
    public BookingPreviewDTO previewBooking(BookingRequestDTO dto) {
        Car car = carRepository.findById(dto.getCarId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + dto.getCarId()));
        return bookingMapper.toPreviewDTO(dto, car);
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, String username) {

        Car car = carRepository.findById(dto.getCarId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + dto.getCarId()));

        // ✅ 1) Check số lượng gốc
        Integer qty = car.getQuantity();
        if (qty == null || qty <= 0) {
            throw new RuntimeException("Xe hiện đã hết số lượng để cho thuê");
        }

        // ✅ 2) Tính số lượng khả dụng theo trạng thái xe (yêu cầu của bạn)
        // RENTED/MAINTENANCE => trừ 1 suất khả dụng
        int baseAvailable = qty;
        if (car.getStatus() == CarStatus.RENTED || car.getStatus() == CarStatus.MAINTENANCE) {
            baseAvailable = Math.max(0, qty - 1);
        }

        // Nếu baseAvailable = 0 => khỏi cần check lịch
        if (baseAvailable <= 0) {
            throw new RuntimeException("Xe hiện không có suất khả dụng (đang thuê/bảo trì hoặc hết số lượng)");
        }

        // ✅ 3) Convert thời gian nhận/trả sang LocalDateTime
        LocalTime pickupTime = (dto.getPickupTime() instanceof LocalTime)
                ? (LocalTime) dto.getPickupTime()
                : LocalTime.parse(dto.getPickupTime().toString());

        LocalTime returnTime = (dto.getReturnTime() instanceof LocalTime)
                ? (LocalTime) dto.getReturnTime()
                : LocalTime.parse(dto.getReturnTime().toString());

        LocalDateTime startDT = LocalDateTime.of(dto.getPickupDate(), pickupTime);
        LocalDateTime endDT = LocalDateTime.of(dto.getReturnDate(), returnTime);

        if (!startDT.isBefore(endDT)) {
            throw new RuntimeException("Thời gian nhận/trả không hợp lệ");
        }

        // ✅ 4) Đếm số booking đang ACTIVE trùng lịch (PENDING/CONFIRMED)
        long busy = bookingRepository.countBusyUnits(
                car.getCarId(),
                startDT,
                endDT,
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );

        long availableFinal = baseAvailable - busy;
        if (availableFinal <= 0) {
            throw new RuntimeException(
                    "Không còn xe khả dụng trong thời gian này (bận: " + busy + "/" + baseAvailable + "). " +
                            "Vui lòng chọn khung giờ khác."
            );
        }

        // ✅ 5) Lấy AppUser
        AppUser user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user: " + username));

        // ✅ 6) Lấy Customer gắn với AppUser (1-1)
        Customer customer = customerRepository.findByAppUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Customer cho user: " + username));

        // ✅ 7) cập nhật hồ sơ khách hàng
        customer.setCustomerName(dto.getFullName());
        customer.setCustomerPhone(dto.getPhone());
        customer.setCustomerAddress(dto.getAddress());
        customer.setId_number(dto.getIdNumber());
        customer.setLicense_number(dto.getLicenseNumber());
        customerRepository.save(customer);

        // ✅ 8) Tạo Booking
        Booking booking = bookingMapper.toEntity(dto, car, customer);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toResponseDTO(saved);
    }

    public AvailabilityDTO checkAvailability(Integer carId, LocalDateTime startDT, LocalDateTime endDT) {

        // 1) Validate thời gian
        if (startDT == null || endDT == null) {
            return new AvailabilityDTO(false, 0, 0, 0,
                    "Thiếu thời gian nhận/trả", List.of());
        }
        if (!startDT.isBefore(endDT)) {
            return new AvailabilityDTO(false, 0, 0, 0,
                    "Thời gian nhận/trả không hợp lệ", List.of());
        }

        // 2) Lấy xe
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + carId));

        int qty = car.getQuantity() == null ? 0 : car.getQuantity();

        // 3) Tính baseAvailable theo yêu cầu:
        //    RENTED/MAINTENANCE => trừ 1 suất khả dụng
        int baseAvailable = qty;
        if (car.getStatus() == CarStatus.RENTED || car.getStatus() == CarStatus.MAINTENANCE) {
            baseAvailable = Math.max(0, qty - 1);
        }

        if (baseAvailable <= 0) {
            return new AvailabilityDTO(false, 0, 0, baseAvailable,
                    "Xe hiện không có suất khả dụng (đang thuê/bảo trì hoặc hết số lượng)", List.of());
        }

        // 4) Lấy danh sách booking ACTIVE bị overlap theo DateTime
        List<BookingStatus> active = List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);

        List<Booking> overlaps = bookingRepository.findOverlappingBookings(carId, startDT, endDT, active);

        long busyUnits = overlaps.size(); // 1 booking chiếm 1 xe
        long availableUnits = Math.max(0, (long) baseAvailable - busyUnits);

        // 5) Map busy slots trả cho FE
        List<BusySlotDTO> busySlots = overlaps.stream()
                .map(b -> new BusySlotDTO(
                        LocalDateTime.of(b.getPickupDate(), b.getPickupTime()),
                        LocalDateTime.of(b.getReturnDate(), b.getReturnTime()),
                        b.getStatus()
                ))
                .toList();

        // 6) Build response
        boolean ok = availableUnits > 0;
        String msg = ok
                ? "Có thể đặt xe trong khung giờ đã chọn. Còn " + availableUnits + " xe."
                : "Không khả dụng: xe đã có đơn trùng lịch trong khung giờ này.";

        return new AvailabilityDTO(ok, availableUnits, busyUnits, baseAvailable, msg, busySlots);
    }

    @Override
    public List<BookingResponseDTO> getAllByCustomer(Integer customerId) {
        return bookingRepository.findByCustomer_CustomerId(customerId).stream()
                .map(bookingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO getBookingById(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking với ID: " + bookingId));
        return bookingMapper.toResponseDTO(booking);
    }
}
