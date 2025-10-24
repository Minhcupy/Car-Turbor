package com.example.autostore.dto.admin;

import jakarta.validation.constraints.NotBlank;

public class CarTypeDTO {
    private Integer carTypeId;

    @NotBlank(message = "Tên loại xe không được để trống")
    private String typeName;

    public CarTypeDTO() {}

    public CarTypeDTO(Integer carTypeId, String typeName) {
        this.carTypeId = carTypeId;
        this.typeName = typeName;
    }

    public Integer getCarTypeId() { return carTypeId; }
    public void setCarTypeId(Integer carTypeId) { this.carTypeId = carTypeId; }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }
}
