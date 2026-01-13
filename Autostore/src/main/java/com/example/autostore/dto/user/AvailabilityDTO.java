package com.example.autostore.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityDTO {
    private boolean available;
    private long availableUnits;
    private long busyUnits;
    private int baseAvailable; // sau khi trừ status RENTED/MAINTENANCE
    private String message;
    List<BusySlotDTO> busySlots;
}