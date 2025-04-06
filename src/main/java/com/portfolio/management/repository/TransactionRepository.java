package com.portfolio.management.repository;

import com.portfolio.management.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByPortfolioId(Long portfolioId);
    List<Transaction> findByInvestmentId(Long investmentId);
    List<Transaction> findByPortfolioIdAndInvestmentId(Long portfolioId, Long investmentId);
    List<Transaction> findTop10ByPortfolioIdOrderByDateDesc(Long portfolioId);
}
