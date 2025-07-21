package com.example.autostore.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="CarDetail")
@Data
public class CarDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detailCarId;
    private String engine;
    private String fuelType;
    private int seatCount;
    @OneToOne
    @JoinColumn(name = "carId", referencedColumnName = "carId")
    private Car car;

    public CarDetail() {}

    public CarDetail(Integer detailCarId, String engine, String fuelType, int seatCount, Car car) {
        this.detailCarId = detailCarId;
        this.engine = engine;
        this.fuelType = fuelType;
        this.seatCount = seatCount;
        this.car = car;
    }
}
