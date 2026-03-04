package com.tirthseva.api.service;

import com.tirthseva.api.dto.auth.*;
import com.tirthseva.api.dto.user.UserProfileResponse;
import com.tirthseva.api.entity.User;
import com.tirthseva.api.repository.UserRepository;
import com.tirthseva.api.security.JwtUtil;
import com.tirthseva.api.util.EmailUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EmailUtil emailUtil;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return null;
            }

            // Generate 6-digit OTP
            String otp = String.valueOf(100000 + new Random().nextInt(900000));

            // Create new user
            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .role(request.getRole())
                    .isEmailVerified(false)
                    .emailOTP(otp)
                    .otpExpiry(LocalDateTime.now().plusMinutes(10))
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(user);

            // Send OTP email
            emailUtil.sendOTPEmail(user.getEmail(), user.getName(), otp);

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

            return LoginResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .isEmailVerified(user.getIsEmailVerified())
                    .build();

        } catch (Exception ex) {
            log.error("Registration error: {}", ex.getMessage());
            return null;
        }
    }

    public LoginResponse login(LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                return null;
            }

            String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

            return LoginResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .isEmailVerified(user.getIsEmailVerified())
                    .build();

        } catch (Exception ex) {
            log.error("Login error: {}", ex.getMessage());
            return null;
        }
    }

    @Transactional
    public boolean verifyOTP(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);
        try {
            if (email == null || otp == null) {
                log.warn("Email or OTP is null");
                return false;
            }

            User user = userRepository.findByEmail(email.trim()).orElse(null);

            if (user == null) {
                log.warn("User not found for email: {}", email);
                return false;
            }

            String storedOtp = user.getEmailOTP();
            LocalDateTime expiry = user.getOtpExpiry();

            if (storedOtp == null) {
                log.warn("No OTP stored for user");
                return false;
            }

            if (!otp.trim().equals(storedOtp.trim())) {
                log.warn("OTP mismatch. Provided: {}, Stored: {}", otp, storedOtp);
                return false;
            }

            if (expiry == null || expiry.isBefore(LocalDateTime.now())) {
                log.warn("OTP expired. Expiry: {}, Now: {}", expiry, LocalDateTime.now());
                return false;
            }

            user.setIsEmailVerified(true);
            user.setEmailOTP(null);
            user.setOtpExpiry(null);

            userRepository.save(user);
            log.info("OTP verified successfully for email: {}", email);
            return true;

        } catch (Exception e) {
            log.error("Error verifying OTP", e);
            return false;
        }
    }

    @Transactional
    public boolean resendOTP(String email) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null || user.getIsEmailVerified()) {
                return false;
            }

            // Generate new OTP
            String otp = String.valueOf(100000 + new Random().nextInt(900000));
            user.setEmailOTP(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

            userRepository.save(user);

            // Send OTP email
            emailUtil.sendOTPEmail(user.getEmail(), user.getName(), otp);

            return true;
        } catch (Exception e) {
            log.error("Resend OTP error: {}", e.getMessage());
            return false;
        }
    }

    public UserProfileResponse getUserById(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return null;
        }

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isEmailVerified(user.getIsEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
