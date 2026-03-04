package com.tirthseva.api.repository;

import com.tirthseva.api.entity.Bhaktnivas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BhaktnivasRepository extends JpaRepository<Bhaktnivas, Integer> {
    List<Bhaktnivas> findByServiceProviderId(Integer serviceProviderId);

    List<Bhaktnivas> findByTempleId(Integer templeId);

    @Query("SELECT b FROM Bhaktnivas b WHERE " +
            "(:templeId IS NULL OR b.templeId = :templeId) AND " +
            "(:minPrice IS NULL OR b.pricePerNight >= :minPrice) AND " +
            "(:maxPrice IS NULL OR b.pricePerNight <= :maxPrice) AND " +
            "(:isAvailable IS NULL OR b.isAvailable = :isAvailable) " +
            "ORDER BY b.pricePerNight")
    List<Bhaktnivas> findByFilters(Integer templeId, BigDecimal minPrice, BigDecimal maxPrice, Boolean isAvailable);

    List<Bhaktnivas> findByServiceProviderIdOrderByCreatedAtDesc(Integer serviceProviderId);
}
