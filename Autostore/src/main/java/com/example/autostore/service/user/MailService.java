package com.example.autostore.service.user;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendLoginOtp(String to, String otp, int ttlSeconds) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Mã OTP đăng nhập");
        msg.setText("Mã OTP của bạn: " + otp + "\nHết hạn sau " + (ttlSeconds / 60) + " phút.");
        mailSender.send(msg);
    }
}
