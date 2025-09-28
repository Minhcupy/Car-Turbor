package com.example.autostore.service.user.implement;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.dto.user.BookingPreviewDTO;
import com.example.autostore.dto.user.BookingRequestDTO;
import com.example.autostore.dto.user.BookingResponseDTO;

import com.example.autostore.dto.user.CarItemDTO;
import com.example.autostore.mapper.user.BookingUserMapper;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Car;
import com.example.autostore.model.Customer;
import com.example.autostore.repository.IBookingRepository;
import com.example.autostore.repository.ICarRepository;
import com.example.autostore.repository.ICustomerRepository;
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

    public BookingUserService(
            IBookingRepository bookingRepository,
            ICarRepository carRepository,
            ICustomerRepository customerRepository,
            BookingUserMapper bookingMapper
    ) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.customerRepository = customerRepository;
        this.bookingMapper = bookingMapper;
    }

    @Override
    public BookingPreviewDTO previewBooking(BookingRequestDTO dto) {
        Car car = carRepository.findById(dto.getCarId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + dto.getCarId()));
        return bookingMapper.toPreviewDTO(dto, car);
    }
    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {
        try {
            Car car = carRepository.findById(dto.getCarId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + dto.getCarId()));

            List<Booking> conflicts = bookingRepository.checkCarAvailability(
                    dto.getCarId(),
                    dto.getPickupDate(),
                    dto.getReturnDate()
            );
            if (!conflicts.isEmpty()) {
                throw new RuntimeException("Xe đã được đặt trong thời gian này");
            }

            Customer customer = customerRepository.findByCustomerEmail(dto.getEmail())
                    .orElseGet(() -> {
                        Customer newCustomer = new Customer();
                        newCustomer.setCustomerName(dto.getFullName());
                        newCustomer.setCustomerEmail(dto.getEmail());
                        newCustomer.setCustomerPhone(dto.getPhone());
                        newCustomer.setCustomerAddress(dto.getAddress());
                        newCustomer.setId_number(dto.getIdNumber());
                        newCustomer.setLicense_number(dto.getLicenseNumber());
                        return customerRepository.save(newCustomer);
                    });

            Booking booking = bookingMapper.toEntity(dto, car, customer);
            booking.setStatus(BookingStatus.PENDING);

            Booking saved = bookingRepository.save(booking);
            return bookingMapper.toResponseDTO(saved);

        } catch (Exception e) {
            e.printStackTrace(); // In log ra console
            throw e; // vẫn ném lỗi cho FE
        }
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
