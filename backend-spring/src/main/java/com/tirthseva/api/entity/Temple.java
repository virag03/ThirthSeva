package com.tirthseva.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Temples", indexes = {
        @Index(name = "IX_Temples_City", columnList = "city"),
        @Index(name = "IX_Temples_State", columnList = "state")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Temple {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "ServiceProviderId", nullable = false)
    private Integer serviceProviderId;

    @NotBlank
    @Size(max = 200)
    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @NotBlank
    @Size(max = 200)
    @Column(name = "Location", nullable = false, length = 200)
    private String location;

    @NotBlank
    @Size(max = 100)
    @Column(name = "City", nullable = false, length = 100)
    private String city;

    @NotBlank
    @Size(max = 100)
    @Column(name = "State", nullable = false, length = 100)
    private String state;

    @Size(max = 1000)
    @Column(name = "Description", length = 1000)
    @Builder.Default
    private String description = "";

    @Size(max = 500)
    @Column(name = "ImagePath", length = 500)
    private String imagePath;

    @Column(name = "Latitude")
    @Builder.Default
    private Double latitude = 0.0;

    @Column(name = "Longitude")
    @Builder.Default
    private Double longitude = 0.0;

    @Column(name = "CreatedAt", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Navigation properties - ignored to prevent circular reference
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceProviderId", insertable = false, updatable = false)
    private User serviceProvider;

    @JsonIgnore
    @OneToMany(mappedBy = "temple", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Bhaktnivas> bhaktnivasList = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "temple", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DarshanSlot> darshanSlots = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "temple", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();
}
