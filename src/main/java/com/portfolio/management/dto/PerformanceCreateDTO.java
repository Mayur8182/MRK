package com.portfolio.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PerformanceCreateDTO {
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Total value is required")
    private BigDecimal totalValue;
    
    private BigDecimal dailyChange;
    
    private BigDecimal percentageChange;
    
    @NotNull(message = "Portfolio ID is required")
    private Long portfolioId;
}
