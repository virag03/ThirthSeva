package com.tirthseva.api.dto.booking;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateBookingStatusRequest {
    private String bookingStatus;
}
