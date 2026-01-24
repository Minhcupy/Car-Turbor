package com.example.autostore.service.admin.implement;

import com.example.autostore.Enum.CarStatus;
import com.example.autostore.model.Booking;
import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.model.Car;
import com.example.autostore.repository.IBookingRepository;
import com.example.autostore.repository.ICarRepository;
import com.example.autostore.service.admin.interfaces.IBookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class BookingServiceImpl implements IBookingService {

    private final IBookingRepository bookingRepository;
    private final ICarRepository carRepository;

    public BookingServiceImpl(IBookingRepository bookingRepository, ICarRepository carRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
    }

    @Override
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Override
    public Booking updateBookingStatus(Integer id, BookingStatus status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);

        Car car = booking.getCar();
        if (car != null) {
            if (status == BookingStatus.CONFIRMED) {
                car.setStatus(CarStatus.RENTED);
                carRepository.save(car);
            } else if (status == BookingStatus.COMPLETED || status == BookingStatus.CANCELED) {
                car.setStatus(CarStatus.AVAILABLE);
                carRepository.save(car);
            }
        }

        return bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(Integer id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public Page<Booking> getBookings(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return bookingRepository.findByCustomer_CustomerNameContainingIgnoreCaseOrCar_CarNameContainingIgnoreCase(
                    keyword, keyword, pageable
            );
        }
        return bookingRepository.findAll(pageable);
    }

}
