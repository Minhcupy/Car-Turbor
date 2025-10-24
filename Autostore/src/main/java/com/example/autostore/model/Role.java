package com.example.autostore.model;

import com.example.autostore.Enum.ERole;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="Roles")

public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roleId")
    private Integer roleId;

    @Enumerated(EnumType.STRING)
    @Column
    private ERole name;

    public ERole getName() {
        return name;
    }
    public void setName(ERole name) {
        this.name = name;
    }
    public Integer getRoleId() {
        return roleId;
    }
    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
}
