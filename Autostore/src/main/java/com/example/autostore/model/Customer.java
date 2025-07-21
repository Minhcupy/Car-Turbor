package com.example.autostore.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="Customer")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", unique = true)
    private AppUser appUser;

    public Customer() {
    }
    public Customer(Integer customerId, String customerName, String customerEmail, String customerPhone, String customerAddress) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.customerAddress = customerAddress;
    }


}
