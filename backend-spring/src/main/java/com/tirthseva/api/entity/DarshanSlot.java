package com.tirthseva.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "DarshanSlots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DarshanSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "TempleId", nullable = false)
    private Integer templeId;

    @NotNull
    @Column(name = "Date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "StartTime", nullable = false)
    private LocalTime startTime;

    @NotNull
    @Column(name = "EndTime", nullable = false)
    private LocalTime endTime;

    @NotNull
    @Min(1)
    @Max(1000)
    @Column(name = "Capacity", nullable = false)
    private Integer capacity;

    @NotNull
    @Min(0)
    @Max(1000)
    @Column(name = "AvailableSlots", nullable = false)
    private Integer availableSlots;

    @NotNull
    @DecimalMin("0")
    @DecimalMax("10000")
    @Column(name = "Price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "CreatedAt", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Navigation properties
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TempleId", insertable = false, updatable = false)
    private Temple temple;

    @OneToMany(mappedBy = "darshanSlot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();
}
