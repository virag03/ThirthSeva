package com.tirthseva.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Bookings", indexes = {
        @Index(name = "IX_Bookings_UserId", columnList = "userId"),
        @Index(name = "IX_Bookings_BookingDate", columnList = "bookingDate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "UserId", nullable = false)
    private Integer userId;

    @NotNull
    @Column(name = "TempleId", nullable = false)
    private Integer templeId;

    @Column(name = "BhaktnivasId")
    private Integer bhaktnivasId;

    @Column(name = "DarshanSlotId")
    private Integer darshanSlotId;

    @NotNull
    @Column(name = "BookingDate", nullable = false)
    @Builder.Default
    private LocalDateTime bookingDate = LocalDateTime.now();

    @Column(name = "CheckInDate")
    private LocalDate checkInDate;

    @Column(name = "CheckOutDate")
    private LocalDate checkOutDate;

    @NotNull
    @DecimalMin("0")
    @DecimalMax("100000")
    @Column(name = "TotalAmount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @NotBlank
    @Size(max = 20)
    @Column(name = "PaymentStatus", nullable = false, length = 20)
    @Builder.Default
    private String paymentStatus = "Pending"; // Pending, Completed, Failed, Refunded

    @NotBlank
    @Size(max = 20)
    @Column(name = "BookingStatus", nullable = false, length = 20)
    @Builder.Default
    private String bookingStatus = "Confirmed"; // Confirmed, Cancelled, Completed

    @NotNull
    @Min(1)
    @Max(1000)
    @Column(name = "NumberOfPersons", nullable = false)
    @Builder.Default
    private Integer numberOfPersons = 1;

    @Size(max = 500)
    @Column(name = "SpecialRequests", length = 500)
    private String specialRequests;

    @Column(name = "CreatedAt", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Navigation properties
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TempleId", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Temple temple;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BhaktnivasId", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Bhaktnivas bhaktnivas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DarshanSlotId", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private DarshanSlot darshanSlot;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Payment payment;
}
