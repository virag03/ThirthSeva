package com.tirthseva.api.dto.temple;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTempleRequest {
    private String name;
    private String location;
    private String city;
    private String state;
    private String description;
    private String imagePath;
    private Double latitude;
    private Double longitude;
}
