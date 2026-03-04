package com.tirthseva.api.controller;

import com.tirthseva.api.dto.payment.ProcessPaymentRequest;
import com.tirthseva.api.dto.payment.VerifyPaymentRequest;
import com.tirthseva.api.entity.Payment;
import com.tirthseva.api.entity.User;
import com.tirthseva.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentsController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody ProcessPaymentRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Payment payment = paymentService.processPayment(request.getBookingId(), request.getPaymentMethod(),
                user.getId());

        if (payment == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Payment failed. Booking not found or already paid."));
        }

        return ResponseEntity.ok(payment);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        boolean result = paymentService.verifyPayment(request.getTransactionId());

        if (!result) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Payment not found or failed"));
        }

        return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "status", "Success"));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Payment>> getPaymentHistory(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<Payment> payments = paymentService.getPaymentHistory(user.getId());
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBooking(@PathVariable Integer bookingId) {
        Payment payment = paymentService.getPaymentByBookingId(bookingId);

        if (payment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(payment);
    }
}
