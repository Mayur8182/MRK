package com.portfolio.management.repository;

import com.portfolio.management.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByPortfolioId(Long portfolioId);
    List<Investment> findByPortfolioIdAndIsActiveTrue(Long portfolioId);
}
