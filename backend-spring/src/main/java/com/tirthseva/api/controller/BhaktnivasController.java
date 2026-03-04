package com.tirthseva.api.controller;

import com.tirthseva.api.dto.bhaktnivas.*;
import com.tirthseva.api.entity.Bhaktnivas;
import com.tirthseva.api.entity.User;
import com.tirthseva.api.service.BhaktnivasService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bhaktnivas")
@RequiredArgsConstructor
public class BhaktnivasController {

    private final BhaktnivasService bhaktnivasService;

    @GetMapping
    public ResponseEntity<List<BhaktnivasListDTO>> getAll(
            @RequestParam(required = false) Integer templeId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isAvailable) {
        List<BhaktnivasListDTO> bhaktnivas = bhaktnivasService.getAllBhaktnivas(templeId, minPrice, maxPrice,
                isAvailable);
        return ResponseEntity.ok(bhaktnivas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BhaktnivasDetailDTO> getById(@PathVariable Integer id) {
        BhaktnivasDetailDTO bhaktnivas = bhaktnivasService.getBhaktnivasById(id);

        if (bhaktnivas == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(bhaktnivas);
    }

    @PreAuthorize("hasAnyRole('ServiceProvider', 'Admin')")
    @GetMapping("/my-listings")
    public ResponseEntity<List<BhaktnivasListDTO>> getMyListings(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<BhaktnivasListDTO> listings = bhaktnivasService.getBhaktnivasByProvider(user.getId());
        return ResponseEntity.ok(listings);
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateBhaktnivasRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Bhaktnivas bhaktnivas = bhaktnivasService.createBhaktnivas(request, user.getId());

        if (bhaktnivas == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.created(URI.create("/api/bhaktnivas/" + bhaktnivas.getId())).body(bhaktnivas);
    }

    @PreAuthorize("hasAnyRole('ServiceProvider', 'Admin')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id,
            @Valid @RequestBody UpdateBhaktnivasRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = user.getRole().equals("Admin");
        Integer serviceProviderId = isAdmin ? null : user.getId();

        Bhaktnivas bhaktnivas = bhaktnivasService.updateBhaktnivas(id, request, serviceProviderId);

        if (bhaktnivas == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(bhaktnivas);
    }

    @PreAuthorize("hasAnyRole('ServiceProvider', 'Admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = user.getRole().equals("Admin");
        Integer serviceProviderId = isAdmin ? null : user.getId();

        boolean result = bhaktnivasService.deleteBhaktnivas(id, serviceProviderId);

        if (!result) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Integer id,
            @RequestBody Boolean isAvailable,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean result = bhaktnivasService.updateAvailability(id, isAvailable, user.getId());

        if (!result) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of("message", "Availability updated successfully"));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<Integer> getAvailability(
            @PathVariable Integer id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        Integer capacity = bhaktnivasService.getAvailableCapacity(id, checkIn, checkOut);
        return ResponseEntity.ok(capacity != null ? capacity : 0);
    }

    @PreAuthorize("hasAnyRole('ServiceProvider', 'Admin')")
    @GetMapping("/{id}/slots")
    public ResponseEntity<List<BhaktnivasSlotDTO>> getSlots(
            @PathVariable Integer id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        List<BhaktnivasSlotDTO> slots = bhaktnivasService.getSlots(id, fromDate, toDate);
        return ResponseEntity.ok(slots);
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @PostMapping("/{id}/slots")
    public ResponseEntity<?> releaseSlots(@PathVariable Integer id,
            @Valid @RequestBody ReleaseBhaktnivasSlotsRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean result = bhaktnivasService.releaseSlots(id, request, user.getId());

        if (!result) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Bhaktnivas not found or unauthorized"));
        }

        return ResponseEntity.ok(Map.of("message", "Slots released successfully"));
    }
}
