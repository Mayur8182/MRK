package com.portfolio.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PortfolioCreateDTO {
    
    @NotBlank(message = "Portfolio name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private Boolean isActive = true;
}
