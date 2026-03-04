# OTP System (Spring + .NET) — Detailed Flow (This Project)

This repository contains **two backend implementations** of the same auth flow:

- **Spring Boot backend**: `backend-spring/`
- **ASP.NET Core backend**: `backend/TirthSeva.API/`

Both implement **Email OTP verification** for newly registered users, with:

- 6-digit OTP generation
- OTP stored on the `User` record
- OTP expiry set to **10 minutes**
- endpoints to **verify** OTP and **resend** OTP
- an extra **test/debug endpoint** that returns current OTP state

---

## Core OTP concept (what OTP is doing here)

In this project, OTP is used for **email verification** (not login OTP).

### Data that matters

- **User identity**: email address
- **OTP**: a 6-digit code sent to the user’s email
- **Expiry**: timestamp after which OTP is invalid
- **Verification flag**: `isEmailVerified` / `IsEmailVerified`

The “OTP contract” is:

- OTP is valid only for the matching email
- OTP is valid only until expiry
- Once OTP is verified, user becomes verified and OTP is cleared

---

## Project’s API endpoints (shared concept, two implementations)

### Public endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `GET  /api/auth/test-otp/{email}` (**debug**)

### Protected endpoint

- `GET /api/auth/me` (requires JWT)

---

## High-level OTP flow (end-to-end)

### 1) Register → OTP generated and emailed

**Client → Backend**

- User submits name/email/password/role.

**Backend**

- Checks if email already exists.
- Creates user with:
  - `isEmailVerified=false`
  - `emailOTP=<6-digit>`
  - `otpExpiry/OTPExpiry=now+10min`
- Sends OTP by email.
- Returns a JWT login response (token + user profile fields).

**Client**

- Receives token (user can be “logged in”), but email is still **unverified** until OTP verification.

### 2) Verify OTP → user marked verified

**Client → Backend**

- Sends email + OTP.

**Backend**

- Finds user by email.
- Validates:
  - OTP matches stored OTP
  - expiry is still in the future
- On success:
  - `isEmailVerified=true`
  - clears OTP and expiry in DB
- Returns success message.

### 3) Resend OTP → new OTP replaces old one

**Client → Backend**

- Sends email.

**Backend**

- Finds user by email.
- If user is already verified → reject.
- Generates new OTP + new expiry (10 minutes)
- Saves to DB and emails new OTP
- Returns success message.

---

## Spring Boot implementation (backend-spring)

### Where OTP is generated/stored/sent

- **Register** logic: `backend-spring/src/main/java/com/tirthseva/api/service/AuthService.java`
  - Generates OTP: `String.valueOf(100000 + new Random().nextInt(900000))`
  - Stores on user:
    - `user.emailOTP(otp)`
    - `user.otpExpiry(LocalDateTime.now().plusMinutes(10))`
  - Sends email: `EmailUtil.sendOTPEmail(...)`

- **Verify** logic: `AuthService.verifyOTP(email, otp)`
  - Compares trimmed values
  - Rejects if `otpExpiry` is before `LocalDateTime.now()`
  - On success:
    - `user.setIsEmailVerified(true)`
    - `user.setEmailOTP(null)`
    - `user.setOtpExpiry(null)`

- **Resend** logic:
  - There are **two** resend implementations:
    - `AuthService.resendOTP(email)` (service-layer)
    - `AuthController.resendOTP(...)` (controller-layer)
  - `AuthController` currently regenerates OTP and calls `EmailUtil` directly.

### Endpoints & request objects

- Controller: `backend-spring/src/main/java/com/tirthseva/api/controller/AuthController.java`
  - `POST /api/auth/verify-otp` uses `VerifyOTPRequest` (`email`, `otp`)
  - `POST /api/auth/resend-otp` uses `ResendOTPRequest` (`email`)
  - `GET /api/auth/test-otp/{email}` returns OTP + validity info (debug)

### Security configuration

- `backend-spring/src/main/java/com/tirthseva/api/config/SecurityConfig.java`
  - Allows unauthenticated access to:
    - `/api/auth/verify-otp`
    - `/api/auth/resend-otp`
    - `/api/auth/test-otp/**` (**debug**, publicly accessible)

### Email sending

- `backend-spring/src/main/java/com/tirthseva/api/util/EmailUtil.java`
  - Uses Spring `JavaMailSender`
  - Sends HTML email
  - Mentions validity “10 minutes” in the template

---

## ASP.NET Core implementation (backend/TirthSeva.API)

### Where OTP is generated/stored/sent

- **Register** logic: `backend/TirthSeva.API/Services/AuthService.cs`
  - OTP: `new Random().Next(100000, 999999).ToString()`
  - Stores on user:
    - `EmailOTP = otp`
    - `OTPExpiry = DateTime.UtcNow.AddMinutes(10)`
  - Sends email: `_emailHelper.SendOTPEmailAsync(...)`

- **Verify** logic: `AuthService.VerifyOTPAsync(email, otp)`
  - Rejects if:
    - user not found OR OTP mismatch OR expiry is in the past
  - On success:
    - `IsEmailVerified = true`
    - clears `EmailOTP` and `OTPExpiry`

- **Resend** logic: `backend/TirthSeva.API/Controllers/AuthController.cs`
  - Controller fetches user, generates OTP, saves, then resolves `EmailHelper` from DI to send the email.

### Data model fields (DB)

- `backend/TirthSeva.API/Models/User.cs`
  - `public bool IsEmailVerified { get; set; }`
  - `public string? EmailOTP { get; set; }`
  - `public DateTime? OTPExpiry { get; set; }`

### DTOs

- `backend/TirthSeva.API/DTOs/AuthDTOs.cs`
  - `VerifyOTPRequest` has:
    - `Email` (required, email)
    - `OTP` (required, length 6)
  - `ResendOTPRequest` has:
    - `Email`

### Email sending

- `backend/TirthSeva.API/Helpers/EmailHelper.cs`
  - Uses `MailKit` (`SmtpClient`) + config section `EmailSettings`
  - If username/password are missing or set to `"DISABLED"`, it **skips sending** but still returns success.
  - Prints OTP to console: `Console.WriteLine($"OTP Generated: {otp} for {toEmail}")` (debug).

---

## Sequence-style flow diagrams (what calls what)

### Register flow (both stacks)

1. `POST /api/auth/register`
2. Validate request
3. Check email uniqueness
4. Generate OTP (6 digits)
5. Save user with OTP + expiry + `isEmailVerified=false`
6. Send OTP email
7. Return JWT login response

### Verify flow (both stacks)

1. `POST /api/auth/verify-otp` with `{ email, otp }`
2. Load user by email
3. Validate:
   - stored OTP exists
   - provided OTP matches
   - expiry is not passed
4. Set verified, clear OTP + expiry
5. Return `{ message: "Email verified successfully" }`

### Resend flow (both stacks)

1. `POST /api/auth/resend-otp` with `{ email }`
2. Load user
3. If already verified → reject
4. Generate new OTP + new expiry
5. Save user
6. Send email
7. Return `{ message: "OTP sent successfully" }`

---

## Important production/security notes (current code vs best practice)

These are not “theoretical”—they directly apply to the current implementation.

### 1) OTP generation uses `Random` (predictable)

- **Current**: Java `new Random()`, C# `new Random()`
- **Best practice**: use cryptographically secure RNG:
  - Spring: `SecureRandom`
  - .NET: `RandomNumberGenerator` / `System.Security.Cryptography`

### 2) OTP is stored in plaintext in DB

- **Current**: `emailOTP/EmailOTP` stores raw 6-digit OTP
- **Best practice**: store a hash (e.g., HMAC or salted hash) and compare hashes.
  - Benefit: even if DB leaks, OTPs can’t be used.

### 3) No rate limiting / attempt limiting

- **Risk**: a 6-digit OTP has only 1,000,000 combinations → brute force if endpoints are not throttled.
- **Best practice**:
  - Per email + per IP rate limits
  - Track attempts (e.g., `otpAttemptCount`, `otpLockedUntil`)
  - Add cooldown for resend

### 4) Debug endpoints expose OTP state

- **Current**: `/api/auth/test-otp/{email}` returns OTP + expiry and is allowed publicly (Spring config explicitly permits it).
- **Best practice**:
  - Remove in production OR protect it behind admin auth / dev-only profile.

### 5) Email sending reports success even on failure (.NET)

- `EmailHelper.SendOTPEmailAsync` returns `true` even inside the `catch`.
- **Best practice**: return `false` and surface error appropriately (or log and retry via background jobs).

### 6) Duplicated resend logic (Spring)

- Resend OTP exists in both `AuthService` and `AuthController`.
- **Best practice**: keep OTP generation/sending in service only; controller should call service.

---

## Quick “how to use” from frontend (typical client UX)

- **Register screen**:
  - call `POST /api/auth/register`
  - show “Enter OTP” screen immediately (OTP is emailed)

- **OTP screen**:
  - call `POST /api/auth/verify-otp`
  - on success → proceed into app

- **Resend link/button**:
  - call `POST /api/auth/resend-otp`
  - show “OTP resent” + start a cooldown timer (UX + security)

---

## File map (where to look in this repo)

### Spring

- `backend-spring/src/main/java/com/tirthseva/api/controller/AuthController.java`
- `backend-spring/src/main/java/com/tirthseva/api/service/AuthService.java`
- `backend-spring/src/main/java/com/tirthseva/api/util/EmailUtil.java`
- `backend-spring/src/main/java/com/tirthseva/api/config/SecurityConfig.java`

### .NET

- `backend/TirthSeva.API/Controllers/AuthController.cs`
- `backend/TirthSeva.API/Services/AuthService.cs`
- `backend/TirthSeva.API/Helpers/EmailHelper.cs`
- `backend/TirthSeva.API/Models/User.cs`
- `backend/TirthSeva.API/DTOs/AuthDTOs.cs`

