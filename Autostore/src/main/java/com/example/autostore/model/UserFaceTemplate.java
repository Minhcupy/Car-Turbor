package com.example.autostore.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "user_face_templates",
        uniqueConstraints = @UniqueConstraint(columnNames = "user_id")
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserFaceTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable = false)
    private Long userId;

    // ✅ float32[] serialized bytes
    @Lob
    @Column(name="embedding", nullable = false, columnDefinition = "LONGBLOB")
    private byte[] embedding;

    // ✅ metadata
    @Column(name="dim", nullable = false)
    private Integer dim; // ví dụ 512

    @Column(name="model", nullable = false, length = 64)
    private String model; // ví dụ "arcface_r100"

    @Column(name="version", length = 32)
    private String version; // ví dụ "v1"

    @Column(name="quality_score")
    private Float qualityScore;

    @Column(name="created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name="updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        var now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
