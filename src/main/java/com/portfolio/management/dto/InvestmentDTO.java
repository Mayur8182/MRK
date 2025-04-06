package com.portfolio.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentDTO {
    private Long id;
    private String name;
    private String description;
    private String type;
    private String riskLevel;
    private BigDecimal amount;
    private BigDecimal currentValue;
    private LocalDate purchaseDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Long portfolioId;
}
