package br.com.riannegreiros.AiTaskApp.auth.dto;

public record AuthResponse(String token, Long toeknExpiresIn, String refreshToken,
        Long refreshTokenExpiresIn) {
}
