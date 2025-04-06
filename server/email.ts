import nodemailer from 'nodemailer';

// Check for necessary email credentials
let transporter: nodemailer.Transporter | null = null;
let emailEnabled = false;
// Track failed email attempts for logging purposes
let emailFailedAttempts = 0;
let lastEmailError: string | null = null;

// For testing/development, we can use a fake transporter that just logs emails
const createFakeTransporter = () => {
  return {
    sendMail: async (mailOptions: any) => {
      console.log("🛑 FAKE EMAIL (not actually sent) 🛑");
      console.log(`📧 To: ${mailOptions.to}`);
      console.log(`📋 Subject: ${mailOptions.subject}`);
      console.log("📄 Email would have been sent with the above details");
      
      // Return a fake message ID
      return { messageId: `fake-email-${Date.now()}@test.com` };
    },
    verify: (callback: any) => {
      callback(null, true);
    }
  };
};

// Initialize email transporter function - can be called multiple times to retry connections
function initEmailTransporter() {
  // Only create a real transporter if we have the necessary credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      // For Gmail, use OAuth2 tokens or App Password instead of regular password
      // For most reliable results with Gmail, use App Passwords: https://myaccount.google.com/apppasswords
      transporter = nodemailer.createTransport({
        service: 'gmail',  // Using built-in nodemailer Gmail configuration
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false // Needed in some environments
        }
      });

      // Verify transporter configuration
      transporter.verify((error) => {
        if (error) {
          console.error("Email configuration error:", error);
          console.warn("Please ensure your Gmail account has 'Less secure app access' enabled or you're using an App Password");
          lastEmailError = error.message || "Unknown error";
          emailEnabled = false;
          
          // If we can't use the real transporter, use the fake one in development
          if (process.env.NODE_ENV !== 'production') {
            console.log("⚠️ Using fake email transport for development. Emails will be logged but not sent.");
            transporter = createFakeTransporter() as any;
            emailEnabled = true;
          } else {
            transporter = null;
          }
        } else {
          console.log("SMTP server is ready to send emails");
          emailEnabled = true;
          emailFailedAttempts = 0;
          lastEmailError = null;
        }
      });
    } catch (error: any) {
      console.error("Failed to create email transporter:", error);
      lastEmailError = error.message || "Unknown error during setup";
      emailEnabled = false;
      
      // If we can't use the real transporter, use the fake one in development
      if (process.env.NODE_ENV !== 'production') {
        console.log("⚠️ Using fake email transport for development. Emails will be logged but not sent.");
        transporter = createFakeTransporter() as any;
        emailEnabled = true;
      } else {
        transporter = null;
      }
    }
  } else {
    console.warn("Email credentials not provided. Email functionality will be disabled.");
    lastEmailError = "Missing email credentials";
    emailEnabled = false;
    
    // If we don't have credentials, use the fake transporter in development
    if (process.env.NODE_ENV !== 'production') {
      console.log("⚠️ Using fake email transport for development. Emails will be logged but not sent.");
      transporter = createFakeTransporter() as any;
      emailEnabled = true;
    } else {
      transporter = null;
    }
  }
}

// Initialize the email transporter on startup
initEmailTransporter();

/**
 * Gets the email service status for monitoring purposes
 * @returns Object containing email service status details
 */
export function getEmailStatus() {
  return {
    enabled: emailEnabled,
    failedAttempts: emailFailedAttempts,
    lastError: lastEmailError,
    transporterType: transporter ? (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_USER ? 'fake' : 'real') : 'none'
  };
}

/**
 * Sends an email notification
 * @param to Recipient email address
 * @param subject Email subject
 * @param html HTML content of the email
 * @param options Additional options like priority
 * @returns Promise resolving to the sent message info or null if email is disabled
 */
export async function sendEmail(
  to: string, 
  subject: string, 
  html: string, 
  options: { 
    priority?: 'high' | 'normal' | 'low',
    retry?: boolean
  } = { priority: 'normal', retry: true }
) {
  // Attempt to initialize email if it's not already set up
  if (!emailEnabled || !transporter) {
    console.log("Email not configured, attempting to initialize...");
    initEmailTransporter();
    
    // If still not enabled after initialization attempt
    if (!emailEnabled || !transporter) {
      console.warn("Email sending skipped: Email functionality is disabled due to missing or invalid credentials");
      emailFailedAttempts++;
      return null;
    }
  }
  
  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Manager" <${process.env.EMAIL_USER || "portfolio-manager@example.com"}>`,
      to,
      subject,
      html,
      priority: options.priority
    });
    
    console.log(`Email sent: ${info.messageId}`);
    // Reset failure tracking on success
    emailFailedAttempts = 0;
    lastEmailError = null;
    return info;
  } catch (error: any) {
    console.error("Failed to send email:", error);
    emailFailedAttempts++;
    lastEmailError = error.message;
    
    // Check if this is an authentication error, and reset the transporter if needed
    if (error.message && (
        error.message.includes('authentication') || 
        error.message.includes('auth') || 
        error.message.includes('535') ||
        error.message.includes('credentials')
      )) {
      console.warn("Authentication error detected. Email credentials may be invalid.");
      emailEnabled = false;
      
      // Only switch to fake transport in development environment
      if (process.env.NODE_ENV !== 'production') {
        console.log("⚠️ Switching to fake email transport due to auth error. Emails will be logged but not sent.");
        transporter = createFakeTransporter() as any;
        emailEnabled = true;
        
        // Try resending with fake transport
        if (options.retry) {
          console.log("Retrying with fake transport...");
          return sendEmail(to, subject, html, { ...options, retry: false });
        }
      } else {
        transporter = null;
      }
    }
    
    // Don't throw, just log the error
    console.warn(`Failed to send email to ${to}: ${error.message}`);
    return null;
  }
}

/**
 * Sends a welcome email to a new user
 * @param to Recipient email address
 * @param username Username of the new user
 */
export async function sendWelcomeEmail(to: string, username: string) {
  const subject = "Welcome to Portfolio Manager";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #3b82f6;">Welcome to Portfolio Manager!</h1>
      </div>
      
      <p>Hello ${username},</p>
      
      <p>Thank you for joining Portfolio Manager! We're excited to help you track and optimize your investment portfolio.</p>
      
      <p>With our platform, you can:</p>
      <ul>
        <li>Track multiple investment portfolios</li>
        <li>Monitor performance in real-time</li>
        <li>Analyze risk and return metrics</li>
        <li>Get AI-powered investment recommendations</li>
        <li>Set up alerts for important market events</li>
      </ul>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
        <p>Best regards,<br>The Portfolio Manager Team</p>
      </div>
    </div>
  `;
  
  return sendEmail(to, subject, html);
}

/**
 * Sends an alert notification to the user
 * @param to Recipient email address
 * @param alertType Type of alert (price, risk, etc.)
 * @param details Alert details
 */
export async function sendAlertEmail(to: string, alertType: string, details: any) {
  const subject = `${alertType.toUpperCase()} Alert - Portfolio Manager`;
  const html = generateAlertContent(alertType, details);
  return sendEmail(to, subject, html);
}

/**
 * Generates HTML content for different types of alerts
 */
function generateAlertContent(alertType: string, details: any): string {
  let content = '';
  let color = '#3b82f6'; // Default blue
  
  switch (alertType.toLowerCase()) {
    case 'price':
      color = details.direction === 'up' ? '#10b981' : '#ef4444';
      content = `
        <p>The price of <strong>${details.name}</strong> has ${details.direction === 'up' ? 'increased' : 'decreased'} 
        by <span style="color: ${color}; font-weight: bold;">${details.percentage}%</span>.</p>
        <p>Current price: <strong>${details.currentPrice}</strong></p>
        <p>Previous price: <strong>${details.previousPrice}</strong></p>
      `;
      break;
    
    case 'risk':
      color = '#f59e0b';
      content = `
        <p>Risk level for your portfolio <strong>${details.portfolioName}</strong> has changed 
        to <span style="color: ${color}; font-weight: bold;">${details.riskLevel}</span>.</p>
        <p>This change is due to: <strong>${details.reason}</strong></p>
      `;
      break;
    
    case 'market':
      content = `
        <p>Important market update: <strong>${details.title}</strong></p>
        <p>${details.description}</p>
        <p>Potential impact: <strong>${details.impact}</strong></p>
      `;
      break;
    
    case 'performance':
      const performanceColor = details.performance >= 0 ? '#10b981' : '#ef4444';
      content = `
        <p>Your portfolio <strong>${details.portfolioName}</strong> has 
        ${details.performance >= 0 ? 'gained' : 'lost'} 
        <span style="color: ${performanceColor}; font-weight: bold;">${Math.abs(details.performance)}%</span> 
        in the past ${details.period}.</p>
        <p>Current value: <strong>${details.currentValue}</strong></p>
        <p>Previous value: <strong>${details.previousValue}</strong></p>
      `;
      break;
    
    default:
      content = `
        <p>${details.message || 'You have a new notification from Portfolio Manager.'}</p>
      `;
  }
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: ${color};">${alertType.toUpperCase()} Alert</h1>
      </div>
      
      ${content}
      
      <div style="margin-top: 30px; background-color: #f9fafb; padding: 15px; border-radius: 5px;">
        <p style="margin: 0;">To manage your alert settings, please visit your <a href="#" style="color: #3b82f6; text-decoration: none;">Account Settings</a>.</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
        <p>Best regards,<br>The Portfolio Manager Team</p>
      </div>
    </div>
  `;
}

/**
 * Sends a portfolio performance report email
 * @param to Recipient email address
 * @param portfolioName Portfolio name
 * @param reportData Report data
 */
export async function sendPerformanceReportEmail(to: string, portfolioName: string, reportData: any) {
  const subject = `Performance Report - ${portfolioName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #3b82f6;">Portfolio Performance Report</h1>
        <h2>${portfolioName}</h2>
        <p style="color: #666;">Report Period: ${reportData.startDate} to ${reportData.endDate}</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Summary</h3>
        <p>Total Value: <strong>${reportData.totalValue}</strong></p>
        <p>Total Return: <strong style="color: ${reportData.totalReturn >= 0 ? '#10b981' : '#ef4444'};">
          ${reportData.totalReturn >= 0 ? '+' : ''}${reportData.totalReturn}%
        </strong></p>
        <p>Risk Level: <strong>${reportData.riskLevel}</strong></p>
      </div>
      
      <h3>Top Performing Investments</h3>
      <ul>
        ${reportData.topInvestments.map((inv: any) => `
          <li>
            <strong>${inv.name}</strong>: 
            <span style="color: ${inv.return >= 0 ? '#10b981' : '#ef4444'};">
              ${inv.return >= 0 ? '+' : ''}${inv.return}%
            </span>
          </li>
        `).join('')}
      </ul>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="#" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Full Report
        </a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
        <p>Best regards,<br>The Portfolio Manager Team</p>
      </div>
    </div>
  `;
  
  return sendEmail(to, subject, html);
}

/**
 * Sends a transaction notification email
 * @param to Recipient email address
 * @param transactionData Transaction data
 * @param portfolioName Name of the portfolio
 * @param investmentName Name of the investment
 */
export async function sendTransactionEmail(
  to: string, 
  transactionData: { 
    id: number, 
    transactionType: string, 
    amount: number, 
    date: Date | string, 
    notes?: string 
  },
  portfolioName: string,
  investmentName?: string
) {
  // Format the amount based on transaction type (buy/sell/dividend etc)
  const formattedAmount = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(Math.abs(transactionData.amount));
  
  // Define colors
  const actionColor = transactionData.transactionType === 'buy' ? '#10b981' : 
                      transactionData.transactionType === 'sell' ? '#ef4444' : 
                      transactionData.transactionType === 'dividend' ? '#f59e0b' : '#3b82f6';
  
  // Format transaction type for display
  const formattedType = transactionData.transactionType.charAt(0).toUpperCase() + 
                        transactionData.transactionType.slice(1);
  
  // Format date
  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const subject = `${formattedType} Transaction - ${portfolioName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: ${actionColor};">${formattedType} Transaction</h1>
        <h2>${portfolioName}</h2>
      </div>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Transaction Details</h3>
        <p>Transaction ID: <strong>#${transactionData.id}</strong></p>
        <p>Date: <strong>${formatDate(transactionData.date)}</strong></p>
        <p>Type: <strong style="color: ${actionColor};">${formattedType}</strong></p>
        <p>Amount: <strong style="color: ${actionColor};">${formattedAmount}</strong></p>
        ${investmentName ? `<p>Investment: <strong>${investmentName}</strong></p>` : ''}
        ${transactionData.notes ? `<p>Notes: <em>${transactionData.notes}</em></p>` : ''}
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="#" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Transaction Details
        </a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666;">
        <p>This is an automated notification. If you did not initiate this transaction, please contact our support team immediately.</p>
        <p style="text-align: center;">Best regards,<br>The Portfolio Manager Team</p>
      </div>
    </div>
  `;
  
  // Send with high priority for transaction notifications
  return sendEmail(to, subject, html, { priority: 'high' });
}

/**
 * Sends a password reset email
 * @param to Recipient email address
 * @param username Username
 * @param resetToken Password reset token
 */
export async function sendPasswordResetEmail(to: string, username: string, resetToken: string) {
  const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const subject = "Password Reset Request - Portfolio Manager";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #3b82f6;">Password Reset Request</h1>
      </div>
      
      <p>Hello ${username},</p>
      
      <p>We received a request to reset your password for your Portfolio Manager account. If you didn't make this request, you can safely ignore this email.</p>
      
      <p>To reset your password, click the button below:</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      
      <p>This link will expire in 24 hours.</p>
      
      <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
      <p style="word-break: break-all; background-color: #f1f5f9; padding: 10px; border-radius: 3px;">${resetLink}</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
        <p>Best regards,<br>The Portfolio Manager Team</p>
      </div>
    </div>
  `;
  
  return sendEmail(to, subject, html);
}