package br.com.riannegreiros.AiTaskApp.dto;

public record LoginResponse(String token, Long expiresIn) {
}
