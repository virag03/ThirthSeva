# Darshan Slot Booking Flow: Technical Deep Dive

This document provides a detailed end-to-end technical explanation of the **Darshan Slot Booking** flow, comparing the implementations in **Spring Boot (Java)** and **.NET (C#)**.

---

## 1. Flow Overview

The booking process follows a standard sequence in both backends:
1. **Slot Discovery**: Fetch available Darshan slots for a specific temple and date.
2. **Availability Validation**: Before proceeding to payment, the system ensures the slot still has enough capacity.
3. **Payment & Confirmation**: Once payment is confirmed (via Razorpay), the booking is created, and the slot's available capacity is decremented.

---

## 2. Slot Discovery (Fetching Available Slots)

### .NET Implementation
- **Controller**: [DarshanController.cs](file:///c:/Users/virag/Desktop/AMEYDROP/working_tirthseva/backend/TirthSeva.API/Controllers/DarshanController.cs)
- **Endpoint**: `GET /api/Darshan/available?templeId={id}&date={date}`

```csharp
// DarshanController.cs
[HttpGet("available")]
public async Task<ActionResult<List<DarshanSlotDTO>>> GetAvailableSlots([FromQuery] int templeId, [FromQuery] DateTime date)
{
    var slots = await _darshanService.GetAvailableSlotsAsync(templeId, date);
    return Ok(slots.Select(s => MapToDTO(s)).ToList());
}
```

### Spring Boot Implementation
- **Controller**: [DarshanController.java](file:///c:/Users/virag/Desktop/AMEYDROP/working_tirthseva/backend-spring/src/main/java/com/tirthseva/api/controller/DarshanController.java)
- **Endpoint**: `GET /api/darshan/available?templeId={id}&date={date}`

```java
// DarshanController.java
@GetMapping("/available")
public ResponseEntity<List<DarshanSlotDTO>> getAvailableSlots(
        @RequestParam Integer templeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    List<DarshanSlot> slots = darshanService.getAvailableSlots(templeId, date);
    return ResponseEntity.ok(slots.stream().map(darshanService::mapToDTO).collect(Collectors.toList()));
}
```

---

## 3. Booking & Payment Confirmation

This is the core of the flow where the actual transaction happens. Both backends use a `confirm-and-book` endpoint.

### .NET Implementation
- **Logic Location**: [BookingService.cs](file:///c:/Users/virag/Desktop/AMEYDROP/working_tirthseva/backend/TirthSeva.API/Services/BookingService.cs)
- **Key Method**: `CreateBookingWithPaymentAsync`

**Technical Steps:**
1. **Validation**: Calls `ValidateBookingAvailabilityAsync` to check if `AvailableSlots >= request.NumberOfPersons`.
2. **Atomicity**: Updates the `DarshanSlot` and creates a `Booking` record.
3. **Persistence**: EF Core tracks changes and saves them in a single transaction during `SaveChangesAsync()`.

```csharp
// BookingService.cs
public async Task<Booking?> CreateBookingWithPaymentAsync(CreateBookingRequest request, int userId)
{
    if (!await ValidateBookingAvailabilityAsync(request)) return null;

    if (request.DarshanSlotId.HasValue)
    {
        var darshanSlot = await _context.DarshanSlots.FindAsync(request.DarshanSlotId.Value);
        if (darshanSlot != null)
        {
            darshanSlot.AvailableSlots -= request.NumberOfPersons; // Atomic decrement
        }
    }
    
    var booking = new Booking { /* ... mapping ... */ };
    _context.Bookings.Add(booking);
    await _context.SaveChangesAsync();
    return booking;
}
```

### Spring Boot Implementation
- **Logic Location**: [BookingService.java](file:///c:/Users/virag/Desktop/AMEYDROP/working_tirthseva/backend-spring/src/main/java/com/tirthseva/api/service/BookingService.java)
- **Key Method**: `createBooking`

**Technical Steps:**
1. **Validation**: Checks availability using `validateBookingAvailability`.
2. **Transaction Management**: Uses the `@Transactional` annotation to ensure that the slot decrement and booking creation are atomic.
3. **Repository Pattern**: Uses `darshanSlotRepository.save()` and `bookingRepository.save()`.

```java
// BookingService.java
@Transactional
public Booking createBooking(CreateBookingRequest request, Integer userId) {
    if (!validateBookingAvailability(request)) return null;

    if (request.getDarshanSlotId() != null) {
        DarshanSlot darshanSlot = darshanSlotRepository.findById(request.getDarshanSlotId()).orElse(null);
        if (darshanSlot != null) {
            darshanSlot.setAvailableSlots(darshanSlot.getAvailableSlots() - request.getNumberOfPersons());
            darshanSlotRepository.save(darshanSlot);
        }
    }

    Booking booking = Booking.builder() /* ... mapping ... */.build();
    return bookingRepository.save(booking);
}
```

---

## 4. Key Differences & Similarities

| Feature | .NET (C#) | Spring Boot (Java) |
| :--- | :--- | :--- |
| **ORM** | EF Core (`ApplicationDbContext`) | Hibernate / JPA (`Repositories`) |
| **Transaction** | Implicit (Unit of Work via Context) | Explicit (`@Transactional`) |
| **Date Handling** | `DateTime`, `TimeSpan` | `LocalDate`, `LocalTime` |
| **Result Handling** | `ActionResult<T>`, `Task<T>` | `ResponseEntity<T>`, `List<T>` |
| **Security** | `[Authorize]` attributes | `@PreAuthorize` / Security Config |

---

## 5. Summary of the Flow (Step-by-Step)

1. **Frontend Request**: User chooses a Temple -> Date -> Slot (calls `GET /available`).
2. **Inventory Check**: Backend queries the `DarshanSlots` table filtering for `AvailableSlots > 0`.
3. **Payment Initialized**: Frontend interacts with Razorpay.
4. **Final Confirmation**: Frontend sends `transactionId` and `CreateBookingRequest` to `POST /confirm-and-book`.
5. **State Update**:
   - Backend checks inventory one last time.
   - Slot capacity is reduced (e.g., `AvailableSlots = AvailableSlots - 2`).
   - A new row is added to the `Bookings` table linked to the User and the Slot.
   - A new row is added to the `Payments` table linked to the Booking.
6. **User Receipt**: User receives a "Confirmed" booking status and can see it in "My Bookings".
