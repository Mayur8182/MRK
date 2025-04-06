package com.portfolio.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceDTO {
    private Long id;
    private LocalDate date;
    private BigDecimal totalValue;
    private BigDecimal dailyChange;
    private BigDecimal percentageChange;
    private Long portfolioId;
}
