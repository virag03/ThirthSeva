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

        public async Task<bool> SendOTPEmailAsync(string toEmail, string toName, string otp)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var username = emailSettings["Username"];
                var password = emailSettings["Password"];

                Console.WriteLine($"OTP Generated: {otp} for {toEmail}");

                if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password) && 
                    username != "DISABLED" && password != "DISABLED")
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("TirthSeva", emailSettings["SenderEmail"]));
                    message.To.Add(new MailboxAddress(toName, toEmail));
                    message.Subject = "Your TirthSeva OTP";

                    message.Body = new TextPart("html")
                    {
                        Text = $@"
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                                <h2 style='color: #FF9933;'>TirthSeva - Email Verification</h2>
                                <p>Dear {toName},</p>
                                <p>Your verification OTP is:</p>
                                <div style='text-align: center; margin: 20px 0;'>
                                    <span style='font-size: 32px; font-weight: bold; color: #FF9933; background: #f5f5f5; padding: 10px 20px; border-radius: 5px;'>{otp}</span>
                                </div>
                                <p><strong>This OTP expires in 10 minutes.</strong></p>
                                <p>Best regards,<br>TirthSeva Team</p>
                            </div>
                        "
                    };

                    using var client = new SmtpClient();
                    await client.ConnectAsync(emailSettings["SmtpHost"], 587, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(username, password);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);

                    Console.WriteLine("Email sent successfully!");
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email failed: {ex.Message}");
                return true;
            }
        }
    }
}