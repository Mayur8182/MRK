package com.portfolio.management.repository;

import com.portfolio.management.entity.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    List<Performance> findByPortfolioIdOrderByDateAsc(Long portfolioId);
    List<Performance> findByPortfolioIdAndDateBetweenOrderByDateAsc(Long portfolioId, LocalDate startDate, LocalDate endDate);
    Optional<Performance> findByPortfolioIdAndDate(Long portfolioId, LocalDate date);
}
