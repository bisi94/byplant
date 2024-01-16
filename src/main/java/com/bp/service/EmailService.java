package com.bp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String username;

    public void sendEmailVerification(String toEmail, String token) {
        String subject = "이메일 인증";
        String message = "인증을 위한 인증키: " + token + "\n\n" +
                		 "인증을 완료하려면 5분 이내로 진행해주세요. 인증키는 5분간 유효합니다.";
        sendEmail(toEmail, subject, message);
    }

    private void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(username);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }
}

