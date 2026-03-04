package com.tirthseva.api.service;

import com.tirthseva.api.dto.bhaktnivas.*;
import com.tirthseva.api.entity.Bhaktnivas;
import com.tirthseva.api.entity.BhaktnivasSlot;
import com.tirthseva.api.repository.BhaktnivasRepository;
import com.tirthseva.api.repository.BhaktnivasSlotRepository;
import com.tirthseva.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BhaktnivasService {

    private final BhaktnivasRepository bhaktnivasRepository;
    private final BhaktnivasSlotRepository bhaktnivasSlotRepository;
    private final BookingRepository bookingRepository;

    public List<BhaktnivasListDTO> getAllBhaktnivas(Integer templeId, BigDecimal minPrice,
            BigDecimal maxPrice, Boolean isAvailable) {
        List<Bhaktnivas> bhaktnivasList = bhaktnivasRepository.findByFilters(templeId, minPrice, maxPrice, isAvailable);
        return bhaktnivasList.stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    public BhaktnivasDetailDTO getBhaktnivasById(Integer id) {
        Bhaktnivas bhaktnivas = bhaktnivasRepository.findById(id).orElse(null);
        return bhaktnivas != null ? mapToDetailDTO(bhaktnivas) : null;
    }

    public List<BhaktnivasListDTO> getBhaktnivasByProvider(Integer providerId) {
        return bhaktnivasRepository.findByServiceProviderIdOrderByCreatedAtDesc(providerId).stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Bhaktnivas createBhaktnivas(CreateBhaktnivasRequest request, Integer serviceProviderId) {
        Bhaktnivas bhaktnivas = Bhaktnivas.builder()
                .templeId(request.getTempleId())
                .serviceProviderId(serviceProviderId)
                .name(request.getName())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .pricePerNight(request.getPricePerNight())
                .capacity(request.getCapacity())
                .distanceFromTemple(request.getDistanceFromTemple() != null ? request.getDistanceFromTemple() : "")
                .imageUrl(request.getImageUrl() != null ? request.getImageUrl() : "")
                .latitude(request.getLatitude() != null ? request.getLatitude() : 0.0)
                .longitude(request.getLongitude() != null ? request.getLongitude() : 0.0)
                .amenities(request.getAmenities() != null ? request.getAmenities() : "")
                .contactPhone(request.getContactPhone() != null ? request.getContactPhone() : "")
                .isAvailable(true)
                .createdAt(LocalDateTime.now())
                .build();

        return bhaktnivasRepository.save(bhaktnivas);
    }

    @Transactional
    public Bhaktnivas updateBhaktnivas(Integer id, UpdateBhaktnivasRequest request, Integer serviceProviderId) {
        Bhaktnivas bhaktnivas = bhaktnivasRepository.findById(id).orElse(null);

        if (bhaktnivas == null) {
            return null;
        }

        // If serviceProviderId is provided, check ownership
        if (serviceProviderId != null && !bhaktnivas.getServiceProviderId().equals(serviceProviderId)) {
            return null;
        }

        bhaktnivas.setTempleId(request.getTempleId());
        bhaktnivas.setName(request.getName());
        bhaktnivas.setDescription(request.getDescription() != null ? request.getDescription() : "");
        bhaktnivas.setPricePerNight(request.getPricePerNight());
        bhaktnivas.setCapacity(request.getCapacity());
        bhaktnivas
                .setDistanceFromTemple(request.getDistanceFromTemple() != null ? request.getDistanceFromTemple() : "");
        bhaktnivas.setImageUrl(request.getImageUrl() != null ? request.getImageUrl() : "");
        bhaktnivas.setLatitude(request.getLatitude() != null ? request.getLatitude() : 0.0);
        bhaktnivas.setLongitude(request.getLongitude() != null ? request.getLongitude() : 0.0);
        bhaktnivas.setAmenities(request.getAmenities() != null ? request.getAmenities() : "");
        bhaktnivas.setContactPhone(request.getContactPhone() != null ? request.getContactPhone() : "");
        bhaktnivas.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);

        return bhaktnivasRepository.save(bhaktnivas);
    }

    @Transactional
    public boolean deleteBhaktnivas(Integer id, Integer serviceProviderId) {
        Bhaktnivas bhaktnivas = bhaktnivasRepository.findById(id).orElse(null);

        if (bhaktnivas == null) {
            return false;
        }

        if (serviceProviderId != null && !bhaktnivas.getServiceProviderId().equals(serviceProviderId)) {
            return false;
        }

        // Delete associated bookings first
        bookingRepository.findByBhaktnivasId(id).forEach(bookingRepository::delete);

        bhaktnivasRepository.delete(bhaktnivas);
        return true;
    }

    @Transactional
    public boolean updateAvailability(Integer id, Boolean isAvailable, Integer serviceProviderId) {
        Bhaktnivas bhaktnivas = bhaktnivasRepository.findById(id).orElse(null);

        if (bhaktnivas == null || !bhaktnivas.getServiceProviderId().equals(serviceProviderId)) {
            return false;
        }

        bhaktnivas.setIsAvailable(isAvailable);
        bhaktnivasRepository.save(bhaktnivas);
        return true;
    }

    public Integer getAvailableCapacity(Integer bhaktnivasId, LocalDate checkIn, LocalDate checkOut) {
        List<BhaktnivasSlot> slots = bhaktnivasSlotRepository
                .findByBhaktnivasIdAndDateGreaterThanEqualAndDateLessThan(bhaktnivasId, checkIn, checkOut);

        long nightsCount = checkIn.until(checkOut).getDays();

        if (slots.size() < nightsCount) {
            return 0; // Not all nights are released
        }

        return slots.stream()
                .mapToInt(BhaktnivasSlot::getAvailableCapacity)
                .min()
                .orElse(0);
    }

    public List<BhaktnivasSlotDTO> getSlots(Integer bhaktnivasId, LocalDate fromDate, LocalDate toDate) {
        List<BhaktnivasSlot> slots;

        if (fromDate != null && toDate != null) {
            slots = bhaktnivasSlotRepository.findByBhaktnivasIdAndDateBetween(bhaktnivasId, fromDate, toDate);
        } else {
            slots = bhaktnivasSlotRepository.findByBhaktnivasIdOrderByDateAsc(bhaktnivasId);
        }

        return slots.stream()
                .map(s -> BhaktnivasSlotDTO.builder()
                        .id(s.getId())
                        .bhaktnivasId(s.getBhaktnivasId())
                        .date(s.getDate())
                        .totalCapacity(s.getTotalCapacity())
                        .availableCapacity(s.getAvailableCapacity())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean releaseSlots(Integer bhaktnivasId, ReleaseBhaktnivasSlotsRequest request, Integer providerId) {
        Bhaktnivas bhaktnivas = bhaktnivasRepository.findById(bhaktnivasId).orElse(null);

        if (bhaktnivas == null || !bhaktnivas.getServiceProviderId().equals(providerId)) {
            return false;
        }

        LocalDate currentDate = request.getStartDate();
        while (!currentDate.isAfter(request.getEndDate())) {
            BhaktnivasSlot existingSlot = bhaktnivasSlotRepository
                    .findByBhaktnivasIdAndDate(bhaktnivasId, currentDate)
                    .orElse(null);

            if (existingSlot != null) {
                existingSlot.setTotalCapacity(request.getCapacity());
                existingSlot.setAvailableCapacity(request.getCapacity());
                bhaktnivasSlotRepository.save(existingSlot);
            } else {
                BhaktnivasSlot newSlot = BhaktnivasSlot.builder()
                        .bhaktnivasId(bhaktnivasId)
                        .date(currentDate)
                        .totalCapacity(request.getCapacity())
                        .availableCapacity(request.getCapacity())
                        .build();
                bhaktnivasSlotRepository.save(newSlot);
            }

            currentDate = currentDate.plusDays(1);
        }

        return true;
    }

    private BhaktnivasListDTO mapToListDTO(Bhaktnivas b) {
        return BhaktnivasListDTO.builder()
                .id(b.getId())
                .templeId(b.getTempleId())
                .templeName(b.getTemple() != null ? b.getTemple().getName() : "")
                .name(b.getName())
                .pricePerNight(b.getPricePerNight())
                .capacity(b.getCapacity())
                .isAvailable(b.getIsAvailable())
                .distanceFromTemple(b.getDistanceFromTemple())
                .imageUrl(b.getImageUrl())
                .latitude(b.getLatitude())
                .longitude(b.getLongitude())
                .serviceProviderName(b.getServiceProvider() != null ? b.getServiceProvider().getName() : "")
                .build();
    }

    private BhaktnivasDetailDTO mapToDetailDTO(Bhaktnivas b) {
        return BhaktnivasDetailDTO.builder()
                .id(b.getId())
                .templeId(b.getTempleId())
                .templeName(b.getTemple() != null ? b.getTemple().getName() : "")
                .name(b.getName())
                .description(b.getDescription())
                .pricePerNight(b.getPricePerNight())
                .capacity(b.getCapacity())
                .isAvailable(b.getIsAvailable())
                .distanceFromTemple(b.getDistanceFromTemple())
                .imageUrl(b.getImageUrl())
                .latitude(b.getLatitude())
                .longitude(b.getLongitude())
                .serviceProviderId(b.getServiceProviderId())
                .serviceProviderName(b.getServiceProvider() != null ? b.getServiceProvider().getName() : "")
                .createdAt(b.getCreatedAt())
                .build();
    }
}
