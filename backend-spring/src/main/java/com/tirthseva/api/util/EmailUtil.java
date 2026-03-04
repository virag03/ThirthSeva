package com.tirthseva.api.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailUtil {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${email.sender-name}")
    private String senderName;

    @Async
    public void sendOTPEmail(String toEmail, String userName, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, senderName);
            helper.setTo(toEmail);
            helper.setSubject("TirthSeva - Email Verification OTP");

            String htmlContent = String.format(
                    """
                            <html>
                            <body style="font-family: Arial, sans-serif; padding: 20px;">
                                <div style="max-width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 30px; border-radius: 10px;">
                                    <h2 style="color: #2c3e50; text-align: center;">🙏 Welcome to TirthSeva</h2>
                                    <p style="color: #34495e;">Dear %s,</p>
                                    <p style="color: #34495e;">Thank you for registering with TirthSeva. Please use the following OTP to verify your email address:</p>
                                    <div style="background-color: #e74c3c; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
                                        %s
                                    </div>
                                    <p style="color: #7f8c8d; font-size: 12px;">This OTP is valid for 10 minutes. Please do not share this with anyone.</p>
                                    <hr style="border: none; border-top: 1px solid #bdc3c7;">
                                    <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
                                        This is an automated message from TirthSeva. Please do not reply to this email.
                                    </p>
                                </div>
                            </body>
                            </html>
                            """,
                    userName, otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending OTP email: {}", e.getMessage());
        }
    }
}
