package com.example.autostore.dto.admin;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CarLocationDTO {
    private Integer carId;
    private String carName;
    private String status;
    private Double latitude;
    private Double longitude;
    private String imageUrl;


}
