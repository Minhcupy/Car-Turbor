package com.example.autostore.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CarDTO {
    private String brand;
    private String name;
    private String type;
    private int seatCount;
    private String imageUrl;

}