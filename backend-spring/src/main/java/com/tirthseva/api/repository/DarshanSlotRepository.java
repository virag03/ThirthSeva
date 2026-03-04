package com.tirthseva.api.repository;

import com.tirthseva.api.entity.DarshanSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DarshanSlotRepository extends JpaRepository<DarshanSlot, Integer> {
    List<DarshanSlot> findByTempleId(Integer templeId);

    List<DarshanSlot> findByTempleIdAndDateBetween(Integer templeId, LocalDate fromDate, LocalDate toDate);

    List<DarshanSlot> findByTempleIdAndDateOrderByStartTimeAsc(Integer templeId, LocalDate date);

    List<DarshanSlot> findByTempleIdAndDateAndAvailableSlotsGreaterThanOrderByStartTimeAsc(
            Integer templeId, LocalDate date, Integer minSlots);

    List<DarshanSlot> findByTempleIdOrderByDateAscStartTimeAsc(Integer templeId);
}
