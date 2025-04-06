package com.portfolio.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "investments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Investment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    private String type;
    
    @Column(name = "risk_level")
    private String riskLevel;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(name = "current_value", nullable = false)
    private BigDecimal currentValue;
    
    @Column(name = "purchase_date")
    private LocalDate purchaseDate;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;
    
    @OneToMany(mappedBy = "investment", cascade = CascadeType.ALL)
    private List<Transaction> transactions;
    
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (purchaseDate == null) {
            purchaseDate = LocalDate.now();
        }
    }
}
