package com.bp.controller;

import java.security.SecureRandom;
import java.util.Base64;

public class TokenGenerator {

    public static String generateRandomToken() {
        // 토큰의 길이 설정
        int byteLength = 8;

        // SecureRandom 인스턴스 생성
        SecureRandom secureRandom = new SecureRandom();

        // 바이트 배열 생성
        byte[] randomBytes = new byte[byteLength];
        secureRandom.nextBytes(randomBytes);

        // Base64 인코딩하여 문자열로 변환
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        return token;
    }
}
