package com.tirthseva.api.dto.payment;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessPaymentRequest {
    private Integer bookingId;
    @Builder.Default
    private String paymentMethod = "Mock";
}
