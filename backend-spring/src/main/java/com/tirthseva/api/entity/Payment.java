package com.tirthseva.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "BookingId", nullable = false, unique = true)
    private Integer bookingId;

    @NotNull
    @DecimalMin("0")
    @DecimalMax("100000")
    @Column(name = "Amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank
    @Size(max = 50)
    @Column(name = "PaymentMethod", nullable = false, length = 50)
    @Builder.Default
    private String paymentMethod = ""; // Mock, Stripe, PayPal, UPI

    @Size(max = 200)
    @Column(name = "TransactionId", length = 200)
    private String transactionId;

    @NotBlank
    @Size(max = 20)
    @Column(name = "Status", nullable = false, length = 20)
    @Builder.Default
    private String status = "Pending"; // Pending, Success, Failed, Refunded

    @Size(max = 500)
    @Column(name = "FailureReason", length = 500)
    private String failureReason;

    @Column(name = "CreatedAt", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "CompletedAt")
    private LocalDateTime completedAt;

    // Navigation property
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BookingId", insertable = false, updatable = false)
    private Booking booking;
}
