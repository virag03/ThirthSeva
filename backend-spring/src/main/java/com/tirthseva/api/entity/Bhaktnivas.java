package com.tirthseva.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Bhaktnivas", indexes = {
        @Index(name = "IX_Bhaktnivas_TempleId", columnList = "templeId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bhaktnivas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "TempleId", nullable = false)
    private Integer templeId;

    @NotNull
    @Column(name = "ServiceProviderId", nullable = false)
    private Integer serviceProviderId;

    @NotBlank
    @Size(max = 200)
    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Size(max = 1000)
    @Column(name = "Description", length = 1000)
    @Builder.Default
    private String description = "";

    @NotNull
    @DecimalMin("50")
    @DecimalMax("200")
    @Column(name = "PricePerNight", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @NotNull
    @Min(1)
    @Max(100)
    @Column(name = "Capacity", nullable = false)
    private Integer capacity;

    @Column(name = "IsAvailable", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Size(max = 50)
    @Column(name = "DistanceFromTemple", length = 50)
    @Builder.Default
    private String distanceFromTemple = "";

    @Size(max = 500)
    @Column(name = "ImageUrl", length = 500)
    @Builder.Default
    private String imageUrl = "";

    @Column(name = "Latitude")
    @Builder.Default
    private Double latitude = 0.0;

    @Column(name = "Longitude")
    @Builder.Default
    private Double longitude = 0.0;

    @Size(max = 500)
    @Column(name = "Amenities", length = 500)
    @Builder.Default
    private String amenities = "";

    @Size(max = 20)
    @Column(name = "ContactPhone", length = 20)
    @Builder.Default
    private String contactPhone = "";

    @Column(name = "CreatedAt", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Navigation properties - ignored to prevent circular reference
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TempleId", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Temple temple;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceProviderId", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User serviceProvider;

    @JsonIgnore
    @OneToMany(mappedBy = "bhaktnivas", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Booking> bookings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "bhaktnivas", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<BhaktnivasSlot> slots = new ArrayList<>();
}
