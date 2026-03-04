package com.tirthseva.api.controller;

import com.tirthseva.api.dto.temple.CreateTempleRequest;
import com.tirthseva.api.dto.temple.UpdateTempleRequest;
import com.tirthseva.api.entity.Temple;
import com.tirthseva.api.entity.User;
import com.tirthseva.api.service.TempleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/temples")
@RequiredArgsConstructor
public class TemplesController {

    private final TempleService templeService;

    @GetMapping
    public ResponseEntity<List<Temple>> getAll() {
        List<Temple> temples = templeService.getAllTemples();
        return ResponseEntity.ok(temples);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Temple> getById(@PathVariable Integer id) {
        Temple temple = templeService.getTempleById(id);

        if (temple == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(temple);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Temple>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String city) {
        List<Temple> temples = templeService.searchTemples(query, state, city);
        return ResponseEntity.ok(temples);
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getStates() {
        List<String> states = templeService.getStates();
        return ResponseEntity.ok(states);
    }

    @GetMapping("/cities/{state}")
    public ResponseEntity<List<String>> getCities(@PathVariable String state) {
        List<String> cities = templeService.getCitiesByState(state);
        return ResponseEntity.ok(cities);
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @GetMapping("/my-temples")
    public ResponseEntity<List<Temple>> getMyTemples(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<Temple> temples = templeService.getProviderTemples(user.getId());
        return ResponseEntity.ok(temples);
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @PostMapping
    public ResponseEntity<Temple> create(@RequestBody CreateTempleRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Temple created = templeService.createTemple(request, user.getId());
        return ResponseEntity.created(URI.create("/api/temples/" + created.getId())).body(created);
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id,
            @RequestBody UpdateTempleRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Temple updated = templeService.updateTemple(id, request, user.getId());

        if (updated == null) {
            return ResponseEntity.notFound()
                    .build();
        }

        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ServiceProvider')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean result = templeService.deleteTemple(id, user.getId());

        if (!result) {
            return ResponseEntity.notFound()
                    .build();
        }

        return ResponseEntity.noContent().build();
    }
}
