package com.portfolio.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class InvestmentCreateDTO {
    
    @NotBlank(message = "Investment name is required")
    private String name;
    
    private String description;
    
    private String type;
    
    private String riskLevel;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Current value is required")
    @Positive(message = "Current value must be positive")
    private BigDecimal currentValue;
    
    @NotNull(message = "Portfolio ID is required")
    private Long portfolioId;
    
    private Boolean isActive = true;
}
