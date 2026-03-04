package com.tirthseva.api.repository;

import com.tirthseva.api.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Integer userId);

    @Query("SELECT b FROM Booking b WHERE b.bhaktnivas.serviceProviderId = :providerId ORDER BY b.createdAt DESC")
    List<Booking> findByProviderIdOrderByCreatedAtDesc(Integer providerId);

    List<Booking> findByBhaktnivasId(Integer bhaktnivasId);

    List<Booking> findByDarshanSlotId(Integer darshanSlotId);

    List<Booking> findAllByOrderByCreatedAtDesc();
}
