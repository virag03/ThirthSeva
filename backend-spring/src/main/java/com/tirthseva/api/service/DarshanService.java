package com.tirthseva.api.service;

import com.tirthseva.api.dto.darshan.DarshanSlotCreateRequest;
import com.tirthseva.api.dto.darshan.DarshanSlotDTO;
import com.tirthseva.api.entity.DarshanSlot;
import com.tirthseva.api.repository.DarshanSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DarshanService {

    private final DarshanSlotRepository darshanSlotRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public List<DarshanSlot> getSlotsByTemple(Integer templeId, LocalDate fromDate, LocalDate toDate) {
        if (fromDate != null && toDate != null) {
            return darshanSlotRepository.findByTempleIdAndDateBetween(templeId, fromDate, toDate);
        }
        return darshanSlotRepository.findByTempleIdOrderByDateAscStartTimeAsc(templeId);
    }

    public List<DarshanSlot> getAvailableSlots(Integer templeId, LocalDate date) {
        return darshanSlotRepository.findByTempleIdAndDateAndAvailableSlotsGreaterThanOrderByStartTimeAsc(
                templeId, date, 0);
    }

    public DarshanSlot getSlotById(Integer id) {
        return darshanSlotRepository.findById(id).orElse(null);
    }

    @Transactional
    public DarshanSlot createSlot(DarshanSlotCreateRequest request) {
        try {
            DarshanSlot slot = DarshanSlot.builder()
                    .templeId(request.getTempleId())
                    .date(request.getDate())
                    .startTime(LocalTime.parse(request.getStartTime(), TIME_FORMATTER))
                    .endTime(LocalTime.parse(request.getEndTime(), TIME_FORMATTER))
                    .capacity(request.getCapacity())
                    .availableSlots(request.getCapacity())
                    .price(request.getPrice())
                    .createdAt(LocalDateTime.now())
                    .build();

            return darshanSlotRepository.save(slot);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create darshan slot: " + e.getMessage(), e);
        }
    }

    public DarshanSlotDTO mapToDTO(DarshanSlot s) {
        return DarshanSlotDTO.builder()
                .id(s.getId())
                .templeId(s.getTempleId())
                .date(s.getDate())
                .startTime(s.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")))
                .endTime(s.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")))
                .capacity(s.getCapacity())
                .availableSlots(s.getAvailableSlots())
                .price(s.getPrice())
                .build();
    }
}
