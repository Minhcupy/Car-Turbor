package com.example.autostore.service.user.implement;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.dto.user.BookingPreviewDTO;
import com.example.autostore.dto.user.BookingRequestDTO;
import com.example.autostore.dto.user.BookingResponseDTO;
import com.example.autostore.mapper.user.BookingUserMapper;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Car;
import com.example.autostore.model.Customer;
import com.example.autostore.repository.*;
import com.example.autostore.service.user.interfaces.IBookingUserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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

        // Kiểm tra trùng lịch
        List<Booking> conflicts = bookingRepository.checkCarAvailability(
                dto.getCarId(),
                dto.getPickupDate(),
                dto.getReturnDate()
        );
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Xe đã được đặt trong thời gian này");
        }

        // Lấy AppUser
        AppUser user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user: " + username));

        // Lấy Customer gắn với AppUser (1-1)
        Customer customer = customerRepository.findByAppUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Customer cho user: " + username));

        // Cập nhật thông tin hồ sơ khách hàng nếu form có thay đổi
        customer.setCustomerName(dto.getFullName());
        customer.setCustomerPhone(dto.getPhone());
        customer.setCustomerAddress(dto.getAddress());
        customer.setId_number(dto.getIdNumber());
        customer.setLicense_number(dto.getLicenseNumber());
        customerRepository.save(customer);

        // Tạo Booking
        Booking booking = bookingMapper.toEntity(dto, car, customer);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        return bookingMapper.toResponseDTO(saved);
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
