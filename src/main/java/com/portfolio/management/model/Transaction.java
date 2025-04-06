package com.portfolio.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_type", nullable = false)
    private String transactionType;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    private String notes;
    
    @Column(name = "date")
    private LocalDateTime date;
    
    @PrePersist
    protected void onCreate() {
        date = LocalDateTime.now();
    }
    
    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;
    
    @ManyToOne
    @JoinColumn(name = "investment_id")
    private Investment investment;
}
