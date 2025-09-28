package com.example.autostore.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CarItemDTO {
    private Integer carId;
    private String carName;
    private String brandName;
    private String typeName;
    private String imageUrl;
    private String location;
    private Integer seats;
    private String transmission;
    private String fuelType;
    private Double rating;
    private Integer year;
    private String color;

    // Giá thuê theo ngày
    private Double dailyPrice;
}
