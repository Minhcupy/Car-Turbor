package com.example.autostore.mapper;

import java.time.LocalDateTime;

public interface CustomerBookingProjection {
    Integer getCustomerId();
    String getCustomerName();
    String getCustomerEmail();
    String getCustomerPhone();
    String getCustomerAddress();
    String getStatus();

    LocalDateTime getLastBookingDate();
    String getLastCarName();
    Long getTotalBookings();
}
