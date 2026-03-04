package com.tirthseva.api.controller;

import com.tirthseva.api.dto.booking.*;
import com.tirthseva.api.entity.Booking;
import com.tirthseva.api.entity.Payment;
import com.tirthseva.api.entity.User;
import com.tirthseva.api.repository.BookingRepository;
import com.tirthseva.api.repository.PaymentRepository;
import com.tirthseva.api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingsController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public BookingsController(BookingService bookingService, BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateBooking(@Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean isAvailable = bookingService.validateBookingAvailability(request);
        
        if (!isAvailable) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Selected slot is no longer available"));
        }

        return ResponseEntity.ok(Map.of("message", "Slot is available"));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Booking booking = bookingService.createBooking(request, user.getId());

        if (booking == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Booking failed. Check availability."));
        }

        BookingDetailDTO bookingDto = bookingService.getBookingById(booking.getId());
        return ResponseEntity.created(URI.create("/api/bookings/" + booking.getId())).body(bookingDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDetailDTO> getBookingById(@PathVariable Integer id) {
        BookingDetailDTO booking = bookingService.getBookingById(id);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingListDTO>> getMyBookings(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<BookingListDTO> bookings = bookingService.getUserBookings(user.getId());
        return ResponseEntity.ok(bookings);
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @GetMapping("/provider-bookings")
    public ResponseEntity<List<BookingListDTO>> getProviderBookings(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<BookingListDTO> bookings = bookingService.getProviderBookings(user.getId());
        return ResponseEntity.ok(bookings);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/all")
    public ResponseEntity<List<BookingDetailDTO>> getAllBookings() {
        List<BookingDetailDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = user.getRole().equals("Admin");
        Integer bookingUserId = isAdmin ? null : user.getId();

        boolean result = bookingService.cancelBooking(id, bookingUserId);

        if (!result) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
    }

    @PreAuthorize("hasAnyRole('ServiceProvider', 'Admin')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Integer id,
            @RequestBody UpdateBookingStatusRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = user.getRole().equals("Admin");
        Integer providerId = isAdmin ? null : user.getId();

        boolean result = bookingService.updateBookingStatus(id, request.getBookingStatus(), providerId);

        if (!result) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Booking not found or you don't have permission to update it"));
        }

        return ResponseEntity.ok(Map.of("message", "Booking status updated to " + request.getBookingStatus()));
    }

    @PostMapping("/confirm-and-book")
    public ResponseEntity<?> confirmPaymentAndBook(@Valid @RequestBody CreateBookingRequest request,
            @RequestParam String transactionId,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        // Create booking after successful payment
        Booking booking = bookingService.createBooking(request, user.getId());

        if (booking == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Booking failed. Slot no longer available."));
        }

        // Create payment record
        Payment payment = Payment.builder()
                .bookingId(booking.getId())
                .amount(booking.getTotalAmount())
                .paymentMethod("Razorpay")
                .transactionId(transactionId)
                .status("Success")
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        BookingDetailDTO bookingDto = bookingService.getBookingById(booking.getId());
        return ResponseEntity.ok(bookingDto);
    }
}
