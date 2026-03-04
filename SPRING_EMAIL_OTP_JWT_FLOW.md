## Spring Email OTP + JWT Flow (TirthSeva)

This document explains **only the Spring Boot backend** (`backend-spring/`) OTP flow:

- Where and how the **Email OTP** is generated
- Where the OTP and expiry are **stored in the database**
- How **verification** works
- How this interacts with **JWT-based authentication**

File paths below all refer to the Spring project.

---

## 1. Data model: where OTP is stored

**Entity**: `User`  
Location: `backend-spring/src/main/java/com/tirthseva/api/entity/User.java`

Key fields related to OTP:

```12:62:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\entity\User.java
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
```

- **`emailOTP`**: stores the **6-digit OTP** as a string.
- **`otpExpiry`**: stores the **exact time** after which OTP is invalid.
- **`isEmailVerified`**: becomes `true` **only after** OTP is successfully verified.

These values are saved in the `Users` table and are not exposed in JSON (`@JsonIgnore`).

---

## 2. OTP generation & initial storage (Register)

**Service**: `AuthService`  
Location: `backend-spring/src/main/java/com/tirthseva/api/service/AuthService.java`

### Method: `register(RegisterRequest request)`

Relevant code:

```36:47:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\service\AuthService.java
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
```

Flow:

- Generate a **6-digit OTP** using `Random`.
- Build a new `User`:
  - `isEmailVerified = false`
  - `emailOTP = <generated 6-digit OTP>`
  - `otpExpiry = now + 10 minutes`
- Save user with `userRepository.save(user)`.

So, after **registration**, the OTP and expiry are **stored on the user record**.

---

## 3. Sending the OTP email

**Utility**: `EmailUtil`  
Location: `backend-spring/src/main/java/com/tirthseva/api/util/EmailUtil.java`

Called from `AuthService.register`:

```53:55:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\service\AuthService.java
        // Send OTP email
        emailUtil.sendOTPEmail(user.getEmail(), user.getName(), otp);
```

Email sending implementation:

```26:47:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\util\EmailUtil.java
    @Async
    public void sendOTPEmail(String toEmail, String userName, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, senderName);
            helper.setTo(toEmail);
            helper.setSubject("TirthSeva - Email Verification OTP");

            String htmlContent = String.format(
                    """
                            ...
                                    <p style="color: #34495e;">Thank you for registering with TirthSeva. Please use the following OTP to verify your email address:</p>
                                    <div ...>
                                        %s
                                    </div>
                                    <p style="color: #7f8c8d; font-size: 12px;">This OTP is valid for 10 minutes. Please do not share this with anyone.</p>
                            ...
                            """,
                    userName, otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
```

Summary:

- Uses `JavaMailSender` with config `spring.mail.*`.
- Sends an HTML email showing the OTP and stating it is valid for **10 minutes**.

---

## 4. JWT generation on register / login

**JWT utility**: `JwtUtil`  
Location: `backend-spring/src/main/java/com/tirthseva/api/security/JwtUtil.java`

Used in `AuthService.register` and `AuthService.login`:

```56:65:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\service\AuthService.java
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
```

Token generation:

```31:43:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\security\JwtUtil.java
    public String generateToken(Integer userId, String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiryMinutes * 60 * 1000L);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("role", role)
                .issuer(issuer)
                .audience().add(audience).and()
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }
```

Important:

- **JWT does not include `isEmailVerified` in the claims.**
- The backend knows whether the user is verified via the DB (`User.isEmailVerified`), not from the token itself.

So, after **registration**, the backend:

1. Creates user + stores OTP and expiry.
2. Sends the OTP email.
3. Generates a JWT and returns it in the `LoginResponse`.

---

## 5. Endpoint layer: OTP verify & resend

**Controller**: `AuthController`  
Location: `backend-spring/src/main/java/com/tirthseva/api/controller/AuthController.java`

### 5.1 Verify OTP endpoint

```52:61:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\controller\AuthController.java
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@Valid @RequestBody VerifyOTPRequest request) {
        boolean result = authService.verifyOTP(request.getEmail(), request.getOtp());

        if (!result) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid or expired OTP"));
        }

        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }
```

**Request DTO**: `VerifyOTPRequest`  
Location: `backend-spring/src/main/java/com/tirthseva/api/dto/auth/VerifyOTPRequest.java`

```10:18:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\dto\auth\VerifyOTPRequest.java
public class VerifyOTPRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 6)
    private String otp;
}
```

So the client sends:

- `email`: user’s email
- `otp`: 6-digit OTP received in email

### 5.2 Resend OTP endpoint

```64:85:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\controller\AuthController.java
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
```

**Request DTO**: `ResendOTPRequest`  
Location: `backend-spring/src/main/java/com/tirthseva/api/dto/auth/ResendOTPRequest.java`

This:

- Finds user by email.
- If user is **already verified**, it rejects.
- Generates **new OTP** + new 10-minute expiry.
- Updates `emailOTP` and `otpExpiry` fields.
- Resends email via `EmailUtil`.

---

## 6. OTP validation logic (service)

**Service method**: `AuthService.verifyOTP(String email, String otp)`  
Location: `backend-spring/src/main/java/com/tirthseva/api/service/AuthService.java`

```99:140:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\service\AuthService.java
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
```

Step-by-step:

1. Load user by email.
2. Read `storedOtp` and `expiry` from the DB record.
3. If there is **no stored OTP**, fail.
4. If provided `otp` does not equal `storedOtp`, fail.
5. If `expiry` is missing or before `now`, fail with “expired”.
6. On success:
   - `isEmailVerified = true`
   - `emailOTP = null` (clear OTP)
   - `otpExpiry = null` (clear expiry)
   - save user.

So, **OTP is always validated against the values stored in the `User` entity**.

---

## 7. Security config: which OTP endpoints are public

**Security config**: `SecurityConfig`  
Location: `backend-spring/src/main/java/com/tirthseva/api/config/SecurityConfig.java`

```40:54:c:\Users\virag\Desktop\AMEYDROP\working_tirthseva\backend-spring\src\main\java\com\tirthseva\api\config\SecurityConfig.java
            .authorizeHttpRequests(auth -> auth
                    // Public endpoints
                    .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/verify-otp",
                            "/api/auth/resend-otp", "/api/auth/test-otp/**", "/error")
                    .permitAll()
                    ...
                    // All other requests require authentication
                    .anyRequest().authenticated())
```

Key point:

- **OTP endpoints** (`/verify-otp`, `/resend-otp`, `/test-otp/**`) and `/register`, `/login` are **public** (no JWT required).
- All other API endpoints require a valid JWT (added via `JwtAuthFilter`).

---

## 8. How this all ties into JWT-based authentication

Putting it together:

1. **Register**
   - User registers → `AuthService.register` creates user with OTP & expiry, not verified.
   - Email with OTP is sent.
   - A JWT token is generated and returned.

2. **Login**
   - `/api/auth/login` checks email + password.
   - On success, returns a JWT and the user’s current `isEmailVerified` status in `LoginResponse`.
   - The JWT itself does **not** contain `isEmailVerified`; the DB knows the truth.

3. **Verify OTP**
   - `/api/auth/verify-otp` checks email + OTP against `User.emailOTP` and `User.otpExpiry`.
   - On success, it flips `isEmailVerified=true` and clears OTP + expiry.

4. **Accessing protected APIs**
   - Any secured endpoint uses JWT for authentication (via `JwtAuthFilter` + `JwtUtil`).
   - If your business logic needs to enforce “only verified users can do X”, it should:
     - Load current user from DB using `userId` from JWT.
     - Check `isEmailVerified`.

So the **OTP flow is separate but linked**:

- OTP is handled via public `/verify-otp` and `/resend-otp`.
- JWT is used for auth/authorization.
- The **bridge** is the `User` record and its `isEmailVerified` flag.

---

## 9. Summary of OTP storage & flow

- **Where is OTP stored?**
  - In `User.emailOTP` and `User.otpExpiry` fields (DB columns `EmailOTP`, `OTPExpiry`).
- **Where is it generated?**
  - On register in `AuthService.register`.
  - On resend in `AuthController.resendOTP`.
- **Where is it checked?**
  - In `AuthService.verifyOTP`.
- **How does it relate to JWT?**
  - JWT tokens are generated independently of OTP, but verified status is stored in the DB (`isEmailVerified`) and can be enforced in any business logic that uses the JWT-authenticated user.

