package com.tirthseva.api.dto.payment;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyPaymentRequest {
    private String transactionId;
}
