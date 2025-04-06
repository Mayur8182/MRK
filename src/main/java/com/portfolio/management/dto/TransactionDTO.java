package com.portfolio.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private String transactionType;
    private BigDecimal amount;
    private String notes;
    private LocalDateTime date;
    private Long portfolioId;
    private Long investmentId;
}
