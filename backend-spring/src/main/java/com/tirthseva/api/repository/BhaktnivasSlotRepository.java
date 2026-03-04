package com.tirthseva.api.repository;

import com.tirthseva.api.entity.BhaktnivasSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BhaktnivasSlotRepository extends JpaRepository<BhaktnivasSlot, Integer> {
    List<BhaktnivasSlot> findByBhaktnivasId(Integer bhaktnivasId);

    List<BhaktnivasSlot> findByBhaktnivasIdAndDateBetween(Integer bhaktnivasId, LocalDate startDate, LocalDate endDate);

    List<BhaktnivasSlot> findByBhaktnivasIdAndDateGreaterThanEqualAndDateLessThan(
            Integer bhaktnivasId, LocalDate startDate, LocalDate endDate);

    Optional<BhaktnivasSlot> findByBhaktnivasIdAndDate(Integer bhaktnivasId, LocalDate date);

    List<BhaktnivasSlot> findByBhaktnivasIdOrderByDateAsc(Integer bhaktnivasId);
}
