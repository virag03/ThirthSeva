package com.tirthseva.api.service;

import com.tirthseva.api.dto.temple.CreateTempleRequest;
import com.tirthseva.api.dto.temple.UpdateTempleRequest;
import com.tirthseva.api.entity.Temple;
import com.tirthseva.api.repository.TempleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TempleService {

    private final TempleRepository templeRepository;

    public List<Temple> getAllTemples() {
        return templeRepository.findAllByOrderByNameAsc();
    }

    public Temple getTempleById(Integer id) {
        return templeRepository.findById(id).orElse(null);
    }

    public List<Temple> searchTemples(String query, String state, String city) {
        List<Temple> temples = templeRepository.findAll();

        // Filter by query
        if (query != null && !query.isBlank()) {
            String queryLower = query.toLowerCase();
            temples = temples.stream()
                    .filter(t -> t.getName().toLowerCase().contains(queryLower) ||
                            t.getDescription().toLowerCase().contains(queryLower) ||
                            t.getCity().toLowerCase().contains(queryLower) ||
                            t.getState().toLowerCase().contains(queryLower))
                    .collect(Collectors.toList());
        }

        // Filter by state
        if (state != null && !state.isBlank()) {
            temples = temples.stream()
                    .filter(t -> t.getState().equals(state))
                    .collect(Collectors.toList());
        }

        // Filter by city
        if (city != null && !city.isBlank()) {
            temples = temples.stream()
                    .filter(t -> t.getCity().equals(city))
                    .collect(Collectors.toList());
        }

        return temples.stream()
                .sorted((a, b) -> a.getName().compareTo(b.getName()))
                .collect(Collectors.toList());
    }

    public List<String> getStates() {
        return templeRepository.findDistinctStates();
    }

    public List<String> getCitiesByState(String state) {
        return templeRepository.findDistinctCitiesByState(state);
    }

    public List<Temple> getProviderTemples(Integer providerId) {
        return templeRepository.findByServiceProviderId(providerId);
    }

    @Transactional
    public Temple createTemple(CreateTempleRequest request, Integer serviceProviderId) {
        Temple temple = Temple.builder()
                .serviceProviderId(serviceProviderId)
                .name(request.getName())
                .location(request.getLocation())
                .city(request.getCity())
                .state(request.getState())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .imagePath(request.getImagePath())
                .latitude(request.getLatitude() != null ? request.getLatitude() : 0.0)
                .longitude(request.getLongitude() != null ? request.getLongitude() : 0.0)
                .createdAt(LocalDateTime.now())
                .build();

        return templeRepository.save(temple);
    }

    @Transactional
    public Temple updateTemple(Integer id, UpdateTempleRequest request, Integer providerId) {
        Temple temple = templeRepository.findById(id).orElse(null);

        if (temple == null || !temple.getServiceProviderId().equals(providerId)) {
            return null;
        }

        temple.setName(request.getName());
        temple.setLocation(request.getLocation());
        temple.setCity(request.getCity());
        temple.setState(request.getState());
        temple.setDescription(request.getDescription() != null ? request.getDescription() : "");
        temple.setImagePath(request.getImagePath());
        temple.setLatitude(request.getLatitude() != null ? request.getLatitude() : 0.0);
        temple.setLongitude(request.getLongitude() != null ? request.getLongitude() : 0.0);

        return templeRepository.save(temple);
    }

    @Transactional
    public boolean deleteTemple(Integer id, Integer providerId) {
        Temple temple = templeRepository.findById(id).orElse(null);

        if (temple == null || !temple.getServiceProviderId().equals(providerId)) {
            return false;
        }

        templeRepository.delete(temple);
        return true;
    }
}
