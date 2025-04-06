import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { Portfolio, Investment, Transaction, Performance } from '@shared/schema';

interface ReportData {
  portfolioId: number;
  portfolioName: string;
  generated: Date;
  timeframe: string;
  portfolioData: Portfolio;
  investments: Investment[];
  transactions: Transaction[];
  performance: Performance[];
  summary: {
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    returnPercentage: number;
    investmentCount: number;
    transactionCount: number;
  };
  riskAnalysis?: {
    portfolioRisk: number; // 1-10 scale
    volatility: number;
    diversificationScore: number; // 1-10 scale
    assetAllocation: {
      category: string;
      percentage: number;
    }[];
    riskFactors: {
      factor: string;
      impact: string;
      severity: number; // 1-10 scale
    }[];
  };
}

/**
 * Generates a PDF report for a portfolio
 * @param res Express response object
 * @param reportData Report data
 */
export function generatePDFReport(res: Response, reportData: ReportData): void {
  // Create a PDF document
  const doc = new PDFDocument({
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    size: 'A4'
  });
  
  // Set response headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=portfolio-report-${reportData.portfolioId}.pdf`);
  
  // Pipe the PDF document to the response
  doc.pipe(res);
  
  // Add document title
  doc.fontSize(25)
     .fillColor('#3b82f6')
     .text('Portfolio Performance Report', 100, doc.y, { align: 'center' });
  
  doc.moveDown();
  
  // Add report generation info
  doc.fontSize(12)
     .fillColor('#111827')
     .text(`Portfolio: ${reportData.portfolioName}`, 100, doc.y, { align: 'center' })
     .text(`Generated on: ${reportData.generated.toLocaleString()}`, 100, doc.y, { align: 'center' })
     .text(`Timeframe: ${reportData.timeframe}`, 100, doc.y, { align: 'center' });
  
  doc.moveDown(2);
  
  // Add summary section
  addSection(doc, 'Portfolio Summary');
  
  const returnColor = reportData.summary.totalReturn >= 0 ? '#10b981' : '#ef4444';
  const returnSymbol = reportData.summary.totalReturn >= 0 ? '+' : '';
  
  doc.fillColor('#111827')
     .text(`Total Current Value: $${reportData.summary.totalValue.toFixed(2)}`)
     .text(`Total Cost Basis: $${reportData.summary.totalCost.toFixed(2)}`)
     .fillColor(returnColor)
     .text(`Total Return: ${returnSymbol}$${reportData.summary.totalReturn.toFixed(2)} (${returnSymbol}${reportData.summary.returnPercentage.toFixed(2)}%)`)
     .fillColor('#111827')
     .text(`Number of Investments: ${reportData.summary.investmentCount}`)
     .text(`Number of Transactions: ${reportData.summary.transactionCount}`);
  
  doc.moveDown(2);
  
  // Add investments section
  if (reportData.investments.length > 0) {
    addSection(doc, 'Investments');
    
    // Add investment table headers
    const investmentTableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Name', 50, investmentTableTop);
    doc.text('Type', 200, investmentTableTop);
    doc.text('Cost', 300, investmentTableTop);
    doc.text('Value', 370, investmentTableTop);
    doc.text('Return', 450, investmentTableTop);
    doc.font('Helvetica');
    
    let y = investmentTableTop + 20;
    
    // Add investment data
    reportData.investments.forEach((investment, index) => {
      // Check if we need a new page
      if (y > 700) {
        doc.addPage();
        y = 50;
        
        // Add table headers on new page
        doc.font('Helvetica-Bold');
        doc.text('Name', 50, y);
        doc.text('Type', 200, y);
        doc.text('Cost', 300, y);
        doc.text('Value', 370, y);
        doc.text('Return', 450, y);
        doc.font('Helvetica');
        
        y += 20;
      }
      
      const cost = Number(investment.amount);
      const value = Number(investment.current_value);
      const returnAmount = value - cost;
      const returnPercentage = cost > 0 ? (returnAmount / cost) * 100 : 0;
      const returnColor = returnAmount >= 0 ? '#10b981' : '#ef4444';
      
      // Add gray background for alternating rows
      if (index % 2 === 0) {
        doc.fillColor('#f3f4f6')
           .rect(45, y - 5, 520, 20)
           .fill();
      }
      
      doc.fillColor('#111827')
         .text(investment.name, 50, y, { width: 150, ellipsis: true })
         .text(investment.type, 200, y)
         .text(`$${cost.toFixed(2)}`, 300, y)
         .text(`$${value.toFixed(2)}`, 370, y);
      
      doc.fillColor(returnColor)
         .text(`${returnAmount >= 0 ? '+' : ''}${returnPercentage.toFixed(1)}%`, 450, y);
      
      y += 20;
    });
    
    doc.moveDown(2);
  }
  
  // Add transactions section
  if (reportData.transactions.length > 0) {
    addSection(doc, 'Recent Transactions');
    
    // Add transaction table headers
    const txTableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Date', 50, txTableTop);
    doc.text('Type', 150, txTableTop);
    doc.text('Amount', 250, txTableTop);
    doc.text('Notes', 350, txTableTop);
    doc.font('Helvetica');
    
    let y = txTableTop + 20;
    
    // Add transaction data
    reportData.transactions.forEach((transaction, index) => {
      // Check if we need a new page
      if (y > 700) {
        doc.addPage();
        y = 50;
        
        // Add table headers on new page
        doc.font('Helvetica-Bold');
        doc.text('Date', 50, y);
        doc.text('Type', 150, y);
        doc.text('Amount', 250, y);
        doc.text('Notes', 350, y);
        doc.font('Helvetica');
        
        y += 20;
      }
      
      // Add gray background for alternating rows
      if (index % 2 === 0) {
        doc.fillColor('#f3f4f6')
           .rect(45, y - 5, 520, 20)
           .fill();
      }
      
      doc.fillColor('#111827')
         .text(transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A', 50, y)
         .text(formatTransactionType(transaction.transaction_type), 150, y)
         .text(`$${Number(transaction.amount).toFixed(2)}`, 250, y)
         .text(transaction.notes || '', 350, y, { width: 200, ellipsis: true });
      
      y += 20;
    });
    
    doc.moveDown(2);
  }
  
  // Add performance chart section if there's performance data
  if (reportData.performance.length > 0) {
    addSection(doc, 'Performance History');
    doc.text('The historical performance chart would be displayed here.');
    doc.moveDown();
  }
  
  // Add risk analysis section if available
  if (reportData.riskAnalysis) {
    addSection(doc, 'Risk Analysis');
    
    // Portfolio Risk Score
    doc.fillColor('#111827')
       .fontSize(10)
       .font('Helvetica-Bold')
       .text('Portfolio Risk Score:', 50, doc.y, { continued: true })
       .font('Helvetica')
       .text(` ${reportData.riskAnalysis.portfolioRisk}/10`);
    
    // Create risk score visualization
    const riskBarWidth = 200;
    const riskScore = reportData.riskAnalysis.portfolioRisk;
    const riskY = doc.y + 10;
    
    // Draw background bar
    doc.fillColor('#e5e7eb')
       .rect(50, riskY, riskBarWidth, 10)
       .fill();
    
    // Calculate risk color (green to yellow to red)
    let riskColor = '#ef4444'; // Red by default
    if (riskScore <= 3) {
      riskColor = '#10b981'; // Green for low risk
    } else if (riskScore <= 6) {
      riskColor = '#f59e0b'; // Yellow/amber for medium risk
    }
    
    // Draw filled portion of bar
    const filledWidth = (riskScore / 10) * riskBarWidth;
    doc.fillColor(riskColor)
       .rect(50, riskY, filledWidth, 10)
       .fill();
    
    doc.moveDown(2);
    
    // Volatility
    doc.font('Helvetica-Bold')
       .text('Volatility:', 50, doc.y, { continued: true })
       .font('Helvetica')
       .text(` ${reportData.riskAnalysis.volatility.toFixed(2)}%`);
    
    // Diversification
    doc.font('Helvetica-Bold')
       .text('Diversification Score:', 50, doc.y, { continued: true })
       .font('Helvetica')
       .text(` ${reportData.riskAnalysis.diversificationScore}/10`);
    
    doc.moveDown();
    
    // Asset Allocation
    if (reportData.riskAnalysis.assetAllocation.length > 0) {
      doc.font('Helvetica-Bold')
         .text('Asset Allocation', 50, doc.y);
      
      doc.moveDown(0.5);
      
      reportData.riskAnalysis.assetAllocation.forEach((asset, index) => {
        // Add gray background for alternating rows
        if (index % 2 === 0) {
          doc.fillColor('#f3f4f6')
             .rect(45, doc.y - 3, 220, 16)
             .fill();
        }
        
        doc.fillColor('#111827')
           .font('Helvetica')
           .text(asset.category, 50, doc.y, { continued: true, width: 150 })
           .text(`${asset.percentage.toFixed(1)}%`);
      });
      
      doc.moveDown(1);
    }
    
    // Risk Factors
    if (reportData.riskAnalysis.riskFactors.length > 0) {
      doc.font('Helvetica-Bold')
         .text('Key Risk Factors', 50, doc.y);
      
      doc.moveDown(0.5);
      
      reportData.riskAnalysis.riskFactors.forEach((factor, index) => {
        // Add gray background for alternating rows
        if (index % 2 === 0) {
          doc.fillColor('#f3f4f6')
             .rect(45, doc.y - 3, 520, 30)
             .fill();
        }
        
        // Calculate severity color
        let severityColor = '#ef4444'; // Red for high severity
        if (factor.severity <= 3) {
          severityColor = '#10b981'; // Green for low severity
        } else if (factor.severity <= 6) {
          severityColor = '#f59e0b'; // Yellow/amber for medium severity
        }
        
        doc.fillColor('#111827')
           .font('Helvetica-Bold')
           .text(factor.factor, 50, doc.y)
           .font('Helvetica')
           .text(factor.impact, 70, doc.y, { width: 430 });
        
        // Add severity indicator
        doc.fillColor(severityColor)
           .text(`Severity: ${factor.severity}/10`, 500, doc.y - 14);
      });
      
      doc.moveDown();
    }
  }
  
  // Add disclaimer section
  doc.moveDown();
  doc.fontSize(8)
     .fillColor('#6b7280')
     .text('Disclaimer: This report is for informational purposes only and should not be considered financial advice. Past performance is not indicative of future results.', 100, doc.y, {
       align: 'center'
     });
  
  // Finalize the PDF
  doc.end();
}

/**
 * Generates a CSV report for a portfolio
 * @param res Express response object
 * @param reportData Report data
 */
export function generateCSVReport(res: Response, reportData: ReportData): void {
  // Set response headers for CSV download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=portfolio-report-${reportData.portfolioId}.csv`);
  
  // Build CSV content
  let csvContent = '';
  
  // Add report header
  csvContent += `Portfolio Performance Report,${reportData.portfolioName}\n`;
  csvContent += `Generated on,${reportData.generated.toLocaleString()}\n`;
  csvContent += `Timeframe,${reportData.timeframe}\n\n`;
  
  // Add summary section
  csvContent += 'PORTFOLIO SUMMARY\n';
  csvContent += `Total Current Value,$${reportData.summary.totalValue.toFixed(2)}\n`;
  csvContent += `Total Cost Basis,$${reportData.summary.totalCost.toFixed(2)}\n`;
  csvContent += `Total Return,$${reportData.summary.totalReturn.toFixed(2)}\n`;
  csvContent += `Return Percentage,${reportData.summary.returnPercentage.toFixed(2)}%\n`;
  csvContent += `Number of Investments,${reportData.summary.investmentCount}\n`;
  csvContent += `Number of Transactions,${reportData.summary.transactionCount}\n\n`;
  
  // Add investments section
  if (reportData.investments.length > 0) {
    csvContent += 'INVESTMENTS\n';
    csvContent += 'Name,Type,Risk Level,Cost,Current Value,Return,Return %\n';
    
    reportData.investments.forEach(investment => {
      const cost = Number(investment.amount);
      const value = Number(investment.current_value);
      const returnAmount = value - cost;
      const returnPercentage = cost > 0 ? (returnAmount / cost) * 100 : 0;
      
      csvContent += `"${investment.name}",`;
      csvContent += `"${investment.type}",`;
      csvContent += `"${investment.risk_level || 'N/A'}",`;
      csvContent += `$${cost.toFixed(2)},`;
      csvContent += `$${value.toFixed(2)},`;
      csvContent += `$${returnAmount.toFixed(2)},`;
      csvContent += `${returnPercentage.toFixed(2)}%\n`;
    });
    
    csvContent += '\n';
  }
  
  // Add transactions section
  if (reportData.transactions.length > 0) {
    csvContent += 'RECENT TRANSACTIONS\n';
    csvContent += 'Date,Type,Amount,Notes\n';
    
    reportData.transactions.forEach(transaction => {
      csvContent += `${transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'},`;
      csvContent += `"${formatTransactionType(transaction.transaction_type)}",`;
      csvContent += `$${Number(transaction.amount).toFixed(2)},`;
      csvContent += `"${transaction.notes || ''}"\n`;
    });
    
    csvContent += '\n';
  }
  
  // Add performance history
  if (reportData.performance.length > 0) {
    csvContent += 'PERFORMANCE HISTORY\n';
    csvContent += 'Date,Value\n';
    
    reportData.performance.forEach(perf => {
      csvContent += `${perf.date ? new Date(perf.date).toLocaleDateString() : 'N/A'},`;
      csvContent += `$${Number(perf.value).toFixed(2)}\n`;
    });
    
    csvContent += '\n';
  }
  
  // Add risk analysis if available
  if (reportData.riskAnalysis) {
    csvContent += 'RISK ANALYSIS\n';
    csvContent += `Portfolio Risk Score,${reportData.riskAnalysis.portfolioRisk}/10\n`;
    csvContent += `Volatility,${reportData.riskAnalysis.volatility.toFixed(2)}%\n`;
    csvContent += `Diversification Score,${reportData.riskAnalysis.diversificationScore}/10\n\n`;
    
    // Asset Allocation
    if (reportData.riskAnalysis.assetAllocation.length > 0) {
      csvContent += 'ASSET ALLOCATION\n';
      csvContent += 'Category,Percentage\n';
      
      reportData.riskAnalysis.assetAllocation.forEach(asset => {
        csvContent += `"${asset.category}",${asset.percentage.toFixed(1)}%\n`;
      });
      
      csvContent += '\n';
    }
    
    // Risk Factors
    if (reportData.riskAnalysis.riskFactors.length > 0) {
      csvContent += 'KEY RISK FACTORS\n';
      csvContent += 'Factor,Impact,Severity\n';
      
      reportData.riskAnalysis.riskFactors.forEach(factor => {
        csvContent += `"${factor.factor}","${factor.impact}",${factor.severity}/10\n`;
      });
    }
  }
  
  // Send the CSV content
  res.send(csvContent);
}

/**
 * Helper function to format transaction type for display
 */
function formatTransactionType(type: string): string {
  // Capitalize first letter of each word
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper function to add a section title to the PDF
 */
function addSection(doc: import('pdfkit'), title: string): void {
  doc.moveDown()
     .fontSize(14)
     .fillColor('#3b82f6')
     .text(title)
     .moveDown(0.5);
  
  // Add a horizontal line
  const y = doc.y;
  doc.moveTo(50, y)
     .lineTo(doc.page.width - 50, y)
     .strokeColor('#e5e7eb')
     .stroke();
  
  doc.moveDown(0.5);
}