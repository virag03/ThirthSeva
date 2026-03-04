package com.tirthseva.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "BhaktnivasSlots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BhaktnivasSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @NotNull
    @Column(name = "BhaktnivasId", nullable = false)
    private Integer bhaktnivasId;

    @NotNull
    @Column(name = "Date", nullable = false)
    private LocalDate date;

    @NotNull
    @Min(1)
    @Max(1000)
    @Column(name = "TotalCapacity", nullable = false)
    private Integer totalCapacity;

    @NotNull
    @Column(name = "AvailableCapacity", nullable = false)
    private Integer availableCapacity;

    // Navigation property
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BhaktnivasId", insertable = false, updatable = false)
    private Bhaktnivas bhaktnivas;
}
