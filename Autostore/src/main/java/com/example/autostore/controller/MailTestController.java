package com.example.autostore.controller;

import com.example.autostore.service.user.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/test")
public class MailTestController {

    private final MailService mailService;

    @GetMapping("/send-mail")
    public String send() {
        mailService.sendLoginOtp("minh12342004247@gmail.com", "123456", 300);
        return "sent";
    }
}