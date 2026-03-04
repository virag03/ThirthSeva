package com.tirthseva.api.controller;

import com.tirthseva.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/database")
@RequiredArgsConstructor
public class DatabaseController {

    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            long totalUsers = userRepository.count();
            long verifiedUsers = userRepository.countByIsEmailVerified(true);
            long unverifiedUsers = userRepository.countByIsEmailVerified(false);

            return ResponseEntity.ok(Map.of(
                    "TotalUsers", totalUsers,
                    "VerifiedUsers", verifiedUsers,
                    "UnverifiedUsers", unverifiedUsers));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        try {
            var users = userRepository.findAll().stream()
                    .map(u -> Map.of(
                            "Id", u.getId(),
                            "Name", u.getName(),
                            "Email", u.getEmail(),
                            "Role", u.getRole(),
                            "IsEmailVerified", u.getIsEmailVerified(),
                            "EmailOTP", u.getEmailOTP() != null ? u.getEmailOTP() : "",
                            "OTPExpiry", u.getOtpExpiry() != null ? u.getOtpExpiry().toString() : "",
                            "CreatedAt", u.getCreatedAt().toString()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(users);
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
