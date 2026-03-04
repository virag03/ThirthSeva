package com.tirthseva.api.dto.booking;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDetailDTO {
    private Integer id;
    private Integer userId;
    private String userName;
    private String userEmail;
    private Integer templeId;
    private String templeName;
    private Integer bhaktnivasId;
    private String bhaktnivasName;
    private Integer darshanSlotId;
    private LocalDate darshanDate;
    private String darshanTime;
    private LocalDateTime bookingDate;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String bookingStatus;
    private Integer numberOfPersons;
    private String specialRequests;
    private LocalDateTime createdAt;
}
