package com.example.autostore.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PricingDTO {

    private Integer pricingId;

    @NotBlank(message = "Đơn vị giá (unit) không được để trống, ví dụ: DAY, HOUR")
    private String unit;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải > 0")
    private BigDecimal price;

    @NotNull(message = "carId không được để trống")
    private Integer carId;
}
