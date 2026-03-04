package com.tirthseva.api.repository;

import com.tirthseva.api.entity.Temple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TempleRepository extends JpaRepository<Temple, Integer> {
    List<Temple> findByServiceProviderId(Integer serviceProviderId);

    List<Temple> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCityContainingIgnoreCaseOrStateContainingIgnoreCase(
            String name, String description, String city, String state);

    List<Temple> findByState(String state);

    List<Temple> findByCity(String city);

    List<Temple> findByStateAndCity(String state, String city);

    @Query("SELECT DISTINCT t.state FROM Temple t ORDER BY t.state")
    List<String> findDistinctStates();

    @Query("SELECT DISTINCT t.city FROM Temple t WHERE t.state = :state ORDER BY t.city")
    List<String> findDistinctCitiesByState(String state);

    List<Temple> findAllByOrderByNameAsc();
}
