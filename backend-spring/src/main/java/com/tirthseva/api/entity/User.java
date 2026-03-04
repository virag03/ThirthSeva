package com.tirthseva.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Users", indexes = {
        @Index(name = "IX_Users_Email", columnList = "email", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column(name = "Email", nullable = false, length = 100, unique = true)
    private String email;

    @NotBlank
    @JsonIgnore
    @Column(name = "PasswordHash", nullable = false)
    private String passwordHash;

    @NotBlank
    @Size(max = 20)
    @Column(name = "Role", nullable = false, length = 20)
    @Builder.Default
    private String role = "User"; // User, ServiceProvider, Admin

    @Column(name = "IsEmailVerified", nullable = false)
    @Builder.Default
    private Boolean isEmailVerified = false;

    @JsonIgnore
    @Column(name = "EmailVerificationToken")
    private String emailVerificationToken;

    @JsonIgnore
    @Column(name = "EmailOTP")
    private String emailOTP;

    @JsonIgnore
    @Column(name = "OTPExpiry")
    private LocalDateTime otpExpiry;

    @Column(name = "CreatedAt", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Navigation properties - ignored to prevent circular reference
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Booking> bookings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "serviceProvider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Bhaktnivas> bhaktnivasListings = new ArrayList<>();
}
