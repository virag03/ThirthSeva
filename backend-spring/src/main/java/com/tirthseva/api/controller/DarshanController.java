package com.tirthseva.api.controller;

import com.tirthseva.api.dto.darshan.DarshanSlotCreateRequest;
import com.tirthseva.api.dto.darshan.DarshanSlotDTO;
import com.tirthseva.api.entity.DarshanSlot;
import com.tirthseva.api.service.DarshanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/darshan")
@RequiredArgsConstructor
public class DarshanController {

    private final DarshanService darshanService;

    @GetMapping("/temple/{templeId}")
    public ResponseEntity<List<DarshanSlotDTO>> getByTemple(
            @PathVariable Integer templeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        List<DarshanSlot> slots = darshanService.getSlotsByTemple(templeId, fromDate, toDate);
        List<DarshanSlotDTO> dtos = slots.stream()
                .map(darshanService::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/available")
    public ResponseEntity<List<DarshanSlotDTO>> getAvailableSlots(
            @RequestParam Integer templeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<DarshanSlot> slots = darshanService.getAvailableSlots(templeId, date);
        List<DarshanSlotDTO> dtos = slots.stream()
                .map(darshanService::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DarshanSlotDTO> getById(@PathVariable Integer id) {
        DarshanSlot slot = darshanService.getSlotById(id);

        if (slot == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(darshanService.mapToDTO(slot));
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @PostMapping
    public ResponseEntity<DarshanSlotDTO> createSlot(@Valid @RequestBody DarshanSlotCreateRequest request) {
        try {
            System.out.println("Creating darshan slot with request: " + request);
            DarshanSlot createdSlot = darshanService.createSlot(request);
            DarshanSlotDTO dto = darshanService.mapToDTO(createdSlot);
            System.out.println("Successfully created darshan slot with ID: " + createdSlot.getId());
            return ResponseEntity.created(URI.create("/api/darshan/" + createdSlot.getId())).body(dto);
        } catch (Exception e) {
            System.err.println("Error creating darshan slot: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // Temporary test endpoint without authentication
    @PostMapping("/test")
    public ResponseEntity<DarshanSlotDTO> createSlotTest(@Valid @RequestBody DarshanSlotCreateRequest request) {
        try {
            System.out.println("TEST: Creating darshan slot with request: " + request);
            DarshanSlot createdSlot = darshanService.createSlot(request);
            DarshanSlotDTO dto = darshanService.mapToDTO(createdSlot);
            System.out.println("TEST: Successfully created darshan slot with ID: " + createdSlot.getId());
            return ResponseEntity.created(URI.create("/api/darshan/" + createdSlot.getId())).body(dto);
        } catch (Exception e) {
            System.err.println("TEST: Error creating darshan slot: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
