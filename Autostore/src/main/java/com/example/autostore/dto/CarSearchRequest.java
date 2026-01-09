package com.example.autostore.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CarSearchRequest {
    private String pickupLocation;
    private String returnLocation;

    private LocalDate pickupDate;
    private LocalDate returnDate;
    private LocalTime pickupTime;
    private LocalTime returnTime;

    private String keyword; // carName/brand/type
    private String fuelType; // gasoline/electric
    private Integer seats;

    // optional
    private Double minPrice;
    private Double maxPrice;
}
