package com.portfolio.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal totalValue;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Long userId;
}
