package com.tirthseva.api.service;

import com.tirthseva.api.dto.booking.*;
import com.tirthseva.api.entity.*;
import com.tirthseva.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final DarshanSlotRepository darshanSlotRepository;
    private final BhaktnivasSlotRepository bhaktnivasSlotRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public boolean validateBookingAvailability(CreateBookingRequest request) {
        // Validate booking
        if (request.getBhaktnivasId() == null && request.getDarshanSlotId() == null) {
            return false; // Must book either Bhaktnivas or Darshan
        }

        // Validate NumberOfPersons for Darshan (max 4)
        if (request.getDarshanSlotId() != null &&
                (request.getNumberOfPersons() < 1 || request.getNumberOfPersons() > 4)) {
            return false;
        }

        // Check Darshan slot availability if booking Darshan
        if (request.getDarshanSlotId() != null) {
            DarshanSlot darshanSlot = darshanSlotRepository.findById(request.getDarshanSlotId()).orElse(null);
            if (darshanSlot == null || darshanSlot.getAvailableSlots() < request.getNumberOfPersons()) {
                return false; // Slot not available or insufficient capacity
            }
        }

        // Check Bhaktnivas availability if booking Bhaktnivas
        if (request.getBhaktnivasId() != null && request.getCheckInDate() != null
                && request.getCheckOutDate() != null) {
            LocalDate checkIn = request.getCheckInDate();
            LocalDate checkOut = request.getCheckOutDate();

            List<BhaktnivasSlot> slots = bhaktnivasSlotRepository
                    .findByBhaktnivasIdAndDateGreaterThanEqualAndDateLessThan(
                            request.getBhaktnivasId(), checkIn, checkOut);

            long nightsCount = checkIn.until(checkOut).getDays();
            if (slots.size() < nightsCount) {
                return false; // Some dates don't have slots released
            }

            for (BhaktnivasSlot slot : slots) {
                if (slot.getAvailableCapacity() < request.getNumberOfPersons()) {
                    return false; // Insufficient capacity on at least one day
                }
            }
        }

        return true;
    }

    @Transactional
    public Booking createBooking(CreateBookingRequest request, Integer userId) {
        // Validate availability before creating booking
        if (!validateBookingAvailability(request)) {
            return null;
        }

        // Decrement availability since booking is confirmed (payment already successful)
        if (request.getDarshanSlotId() != null) {
            DarshanSlot darshanSlot = darshanSlotRepository.findById(request.getDarshanSlotId()).orElse(null);
            if (darshanSlot != null) {
                darshanSlot.setAvailableSlots(darshanSlot.getAvailableSlots() - request.getNumberOfPersons());
                darshanSlotRepository.save(darshanSlot);
            }
        }

        if (request.getBhaktnivasId() != null && request.getCheckInDate() != null
                && request.getCheckOutDate() != null) {
            LocalDate checkIn = request.getCheckInDate();
            LocalDate checkOut = request.getCheckOutDate();

            List<BhaktnivasSlot> slots = bhaktnivasSlotRepository
                    .findByBhaktnivasIdAndDateGreaterThanEqualAndDateLessThan(
                            request.getBhaktnivasId(), checkIn, checkOut);

            for (BhaktnivasSlot slot : slots) {
                slot.setAvailableCapacity(slot.getAvailableCapacity() - request.getNumberOfPersons());
                bhaktnivasSlotRepository.save(slot);
            }
        }

        Booking booking = Booking.builder()
                .userId(userId)
                .templeId(request.getTempleId())
                .bhaktnivasId(request.getBhaktnivasId())
                .darshanSlotId(request.getDarshanSlotId())
                .numberOfPersons(request.getNumberOfPersons())
                .bookingDate(LocalDateTime.now())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .totalAmount(request.getTotalAmount())
                .paymentStatus("Completed")
                .bookingStatus("Confirmed")
                .specialRequests(request.getSpecialRequests())
                .createdAt(LocalDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }

    public List<BookingListDTO> getUserBookings(Integer userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    public List<BookingListDTO> getProviderBookings(Integer providerId) {
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId).stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDetailDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDetailDTO)
                .collect(Collectors.toList());
    }

    public BookingDetailDTO getBookingById(Integer id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        return booking != null ? mapToDetailDTO(booking) : null;
    }

    @Transactional
    public boolean cancelBooking(Integer id, Integer userId) {
        Booking booking;

        if (userId != null) {
            booking = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                    .filter(b -> b.getId().equals(id))
                    .findFirst().orElse(null);
        } else {
            booking = bookingRepository.findById(id).orElse(null);
        }

        if (booking == null || "Cancelled".equals(booking.getBookingStatus())) {
            return false;
        }

        booking.setBookingStatus("Cancelled");

        // Restore Darshan slot if applicable
        if (booking.getDarshanSlotId() != null) {
            DarshanSlot darshanSlot = darshanSlotRepository.findById(booking.getDarshanSlotId()).orElse(null);
            if (darshanSlot != null) {
                darshanSlot.setAvailableSlots(darshanSlot.getAvailableSlots() + booking.getNumberOfPersons());
                darshanSlotRepository.save(darshanSlot);
            }
        }

        bookingRepository.save(booking);
        return true;
    }

    @Transactional
    public boolean updateBookingStatus(Integer bookingId, String bookingStatus, Integer providerId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking == null) {
            return false;
        }

        // Verify provider owns the Bhaktnivas for this booking
        if (providerId != null && booking.getBhaktnivas() != null &&
                !booking.getBhaktnivas().getServiceProviderId().equals(providerId)) {
            return false;
        }

        // Only allow certain status transitions
        List<String> validStatuses = Arrays.asList("Confirmed", "Cancelled", "Completed");
        if (!validStatuses.contains(bookingStatus)) {
            return false;
        }

        booking.setBookingStatus(bookingStatus);
        bookingRepository.save(booking);
        return true;
    }

    @Transactional
    public boolean updatePaymentStatus(Integer bookingId, String paymentStatus) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return false;
        }

        booking.setPaymentStatus(paymentStatus);
        bookingRepository.save(booking);
        return true;
    }

    private BookingListDTO mapToListDTO(Booking b) {
        String darshanTime = null;
        LocalDate darshanDate = null;

        if (b.getDarshanSlot() != null) {
            darshanDate = b.getDarshanSlot().getDate();
            darshanTime = b.getDarshanSlot().getStartTime().format(TIME_FORMATTER) + " - " +
                    b.getDarshanSlot().getEndTime().format(TIME_FORMATTER);
        }

        return BookingListDTO.builder()
                .id(b.getId())
                .templeName(b.getTemple() != null ? b.getTemple().getName() : "")
                .bhaktnivasName(b.getBhaktnivas() != null ? b.getBhaktnivas().getName() : null)
                .darshanDate(darshanDate)
                .darshanTime(darshanTime)
                .bookingDate(b.getBookingDate())
                .checkInDate(b.getCheckInDate())
                .checkOutDate(b.getCheckOutDate())
                .totalAmount(b.getTotalAmount())
                .paymentStatus(b.getPaymentStatus())
                .bookingStatus(b.getBookingStatus())
                .numberOfPersons(b.getNumberOfPersons())
                .build();
    }

    private BookingDetailDTO mapToDetailDTO(Booking b) {
        String darshanTime = null;
        LocalDate darshanDate = null;

        if (b.getDarshanSlot() != null) {
            darshanDate = b.getDarshanSlot().getDate();
            darshanTime = b.getDarshanSlot().getStartTime().format(TIME_FORMATTER) + " - " +
                    b.getDarshanSlot().getEndTime().format(TIME_FORMATTER);
        }

        return BookingDetailDTO.builder()
                .id(b.getId())
                .userId(b.getUserId())
                .userName(b.getUser() != null ? b.getUser().getName() : "")
                .userEmail(b.getUser() != null ? b.getUser().getEmail() : "")
                .templeId(b.getTempleId())
                .templeName(b.getTemple() != null ? b.getTemple().getName() : "")
                .bhaktnivasId(b.getBhaktnivasId())
                .bhaktnivasName(b.getBhaktnivas() != null ? b.getBhaktnivas().getName() : null)
                .darshanSlotId(b.getDarshanSlotId())
                .darshanDate(darshanDate)
                .darshanTime(darshanTime)
                .bookingDate(b.getBookingDate())
                .checkInDate(b.getCheckInDate())
                .checkOutDate(b.getCheckOutDate())
                .totalAmount(b.getTotalAmount())
                .paymentStatus(b.getPaymentStatus())
                .bookingStatus(b.getBookingStatus())
                .numberOfPersons(b.getNumberOfPersons())
                .specialRequests(b.getSpecialRequests())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
