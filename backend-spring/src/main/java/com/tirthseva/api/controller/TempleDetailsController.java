package com.tirthseva.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templedetails")
@RequiredArgsConstructor
public class TempleDetailsController {

    @GetMapping("/{templeId}")
    public ResponseEntity<?> getTempleDetails(
            @PathVariable Integer templeId,
            @RequestParam String templeName,
            @RequestParam String city,
            @RequestParam String state) {
        try {
            // For now, return a simple response based on the temple name
            // In production, you would integrate with a proper search API
            var details = generateTempleDetails(templeName, city, state);
            return ResponseEntity.ok(details);
        } catch (Exception ex) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to fetch temple details", "message", ex.getMessage()));
        }
    }

    private Map<String, Object> generateTempleDetails(String templeName, String city, String state) {
        // This is a simplified version. In production, you would use actual web search
        // API
        String description = String.format(
                "%s is a revered Hindu temple located in %s, %s. This sacred shrine attracts " +
                        "thousands of devotees throughout the year who come to seek blessings and experience " +
                        "spiritual peace. The temple is known for its beautiful architecture, rich history, " +
                        "and religious significance in Hindu tradition.",
                templeName, city, state);

        List<String> keyInfo = Arrays.asList(
                String.format("Located in %s, %s, India", city, state),
                "Open for darshan throughout the year",
                "Photography may be restricted in certain areas",
                "Dress code: Traditional/modest clothing recommended",
                "Best time to visit: Early morning or evening Aarti");

        String additionalInfo = String.format(
                "The temple offers various seva and booking options for devotees. Nearby facilities " +
                        "include accommodation (Bhaktnivas) and shops. For specific darshan timings and " +
                        "special puja bookings, please contact the temple administration or check our " +
                        "darshan booking section.\n\nNote: This is general information. For detailed and " +
                        "current information about %s, we recommend visiting official temple websites or " +
                        "contacting the temple directly.",
                templeName);

        return Map.of(
                "description", description,
                "keyInfo", keyInfo,
                "additionalInfo", additionalInfo);
    }
}
