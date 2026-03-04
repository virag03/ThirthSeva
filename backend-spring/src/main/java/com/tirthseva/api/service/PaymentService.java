package com.tirthseva.api.service;

import com.tirthseva.api.entity.Booking;
import com.tirthseva.api.entity.Payment;
import com.tirthseva.api.repository.BookingRepository;
import com.tirthseva.api.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    @Transactional
    public Payment processPayment(Integer bookingId, String paymentMethod, Integer userId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking == null || !booking.getUserId().equals(userId)) {
            return null;
        }

        // Check if already paid
        if (paymentRepository.findByBookingId(bookingId).isPresent()) {
            return null;
        }

        // Mock payment processing
        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .amount(booking.getTotalAmount())
                .paymentMethod(paymentMethod)
                .transactionId("TXN_" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .status("Success")
                .createdAt(LocalDateTime.now())
                .completedAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // Update booking payment status
        bookingService.updatePaymentStatus(bookingId, "Completed");

        return payment;
    }

    public Payment getPaymentByBookingId(Integer bookingId) {
        return paymentRepository.findByBookingId(bookingId).orElse(null);
    }

    public List<Payment> getPaymentHistory(Integer userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public boolean verifyPayment(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId).orElse(null);
        return payment != null && "Success".equals(payment.getStatus());
    }
}
