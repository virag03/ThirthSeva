package com.tirthseva.api.controller;

import com.tirthseva.api.dto.auth.*;
import com.tirthseva.api.dto.user.UserProfileResponse;
import com.tirthseva.api.entity.User;
import com.tirthseva.api.repository.UserRepository;
import com.tirthseva.api.service.AuthService;
import com.tirthseva.api.util.EmailUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final EmailUtil emailUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse result = authService.register(request);

        if (result == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists or registration failed"));
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse result = authService.login(request);

        if (result == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@Valid @RequestBody VerifyOTPRequest request) {
        boolean result = authService.verifyOTP(request.getEmail(), request.getOtp());

        if (!result) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid or expired OTP"));
        }

        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOTP(@Valid @RequestBody ResendOTPRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (user == null || user.getIsEmailVerified()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "User not found or already verified"));
            }

            // Generate new OTP
            String otp = String.valueOf(100000 + new Random().nextInt(900000));
            user.setEmailOTP(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

            userRepository.save(user);

            // Send OTP email
            emailUtil.sendOTPEmail(user.getEmail(), user.getName(), otp);

            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to resend OTP", "error", ex.getMessage()));
        }
    }

    @GetMapping("/test-otp/{email}")
    public ResponseEntity<?> testOTP(@PathVariable String email) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.of(
                    "email", user.getEmail(),
                    "name", user.getName(),
                    "isVerified", user.getIsEmailVerified(),
                    "currentOTP", user.getEmailOTP() != null ? user.getEmailOTP() : "",
                    "otpExpiry", user.getOtpExpiry() != null ? user.getOtpExpiry().toString() : "",
                    "isOTPValid", user.getOtpExpiry() != null && user.getOtpExpiry().isAfter(LocalDateTime.now())));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        UserProfileResponse profile = authService.getUserById(user.getId());

        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile);
    }
}
