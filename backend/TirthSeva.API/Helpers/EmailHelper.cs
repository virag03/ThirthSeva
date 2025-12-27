using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace TirthSeva.API.Helpers
{
    public class EmailHelper
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailHelper> _logger;

        public EmailHelper(IConfiguration configuration, ILogger<EmailHelper> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendVerificationEmailAsync(string toEmail, string toName, string verificationToken)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var frontendUrl = _configuration["AppSettings:FrontendUrl"];
                
                var verificationLink = $"{frontendUrl}/verify-email?token={verificationToken}";

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(
                    emailSettings["SenderName"], 
                    emailSettings["SenderEmail"]
                ));
                message.To.Add(new MailboxAddress(toName, toEmail));
                message.Subject = "Verify Your Email - TirthSeva";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #FF9933;'>Welcome to TirthSeva!</h2>
                            <p>Dear {toName},</p>
                            <p>Thank you for registering with TirthSeva. Please verify your email address by clicking the button below:</p>
                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='{verificationLink}' 
                                   style='background-color: #FF9933; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; display: inline-block;'>
                                    Verify Email
                                </a>
                            </div>
                            <p>Or copy and paste this link in your browser:</p>
                            <p style='word-break: break-all; color: #666;'>{verificationLink}</p>
                            <p>If you didn't create this account, please ignore this email.</p>
                            <p>Best regards,<br>TirthSeva Team</p>
                        </div>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                // Check if email is configured
                var username = emailSettings["Username"];
                var password = emailSettings["Password"];

                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                {
                    _logger.LogWarning("Email not configured. Verification link: {Link}", verificationLink);
                    Console.WriteLine($"\n=== EMAIL VERIFICATION LINK ===");
                    Console.WriteLine($"To: {toEmail}");
                    Console.WriteLine($"Link: {verificationLink}");
                    Console.WriteLine("================================\n");
                    return true; // Return true in development
                }

                using var client = new SmtpClient();
                await client.ConnectAsync(
                    emailSettings["SmtpHost"], 
                    int.Parse(emailSettings["SmtpPort"] ?? "587"),
                    SecureSocketOptions.StartTls
                );
                
                await client.AuthenticateAsync(username, password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email to {Email}", toEmail);
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string toName, string resetToken)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var frontendUrl = _configuration["AppSettings:FrontendUrl"];
                
                var resetLink = $"{frontendUrl}/reset-password?token={resetToken}";

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(
                    emailSettings["SenderName"], 
                    emailSettings["SenderEmail"]
                ));
                message.To.Add(new MailboxAddress(toName, toEmail));
                message.Subject = "Password Reset - TirthSeva";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                            <h2 style='color: #FF9933;'>Password Reset Request</h2>
                            <p>Dear {toName},</p>
                            <p>We received a request to reset your password. Click the button below to proceed:</p>
                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='{resetLink}' 
                                   style='background-color: #800000; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; display: inline-block;'>
                                    Reset Password
                                </a>
                            </div>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request this, please ignore this email.</p>
                            <p>Best regards,<br>TirthSeva Team</p>
                        </div>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                var username = emailSettings["Username"];
                var password = emailSettings["Password"];

                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                {
                    _logger.LogWarning("Email not configured. Password reset link: {Link}", resetLink);
                    Console.WriteLine($"\n=== PASSWORD RESET LINK ===");
                    Console.WriteLine($"To: {toEmail}");
                    Console.WriteLine($"Link: {resetLink}");
                    Console.WriteLine("===========================\n");
                    return true;
                }

                using var client = new SmtpClient();
                await client.ConnectAsync(
                    emailSettings["SmtpHost"], 
                    int.Parse(emailSettings["SmtpPort"] ?? "587"),
                    SecureSocketOptions.StartTls
                );
                
                await client.AuthenticateAsync(username, password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
                return false;
            }
        }
    }
}
