package com.tirthseva.api.repository;

import com.tirthseva.api.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByBookingId(Integer bookingId);

    Optional<Payment> findByTransactionId(String transactionId);

    @Query("SELECT p FROM Payment p WHERE p.booking.userId = :userId ORDER BY p.createdAt DESC")
    List<Payment> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
