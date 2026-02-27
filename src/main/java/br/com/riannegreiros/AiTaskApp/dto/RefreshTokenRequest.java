package br.com.riannegreiros.AiTaskApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RefreshTokenRequest(@NotBlank(message = "Refresh Token is required") @Size(min = 3,
        message = "Refresh Token must be at least 3 characters") String refreshToken) {
}
