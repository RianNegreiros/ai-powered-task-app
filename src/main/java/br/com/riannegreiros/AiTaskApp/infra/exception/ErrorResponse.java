package br.com.riannegreiros.AiTaskApp.infra.exception;

import java.time.LocalDateTime;

public record ErrorResponse(String message, int status, LocalDateTime timestamp) {
}
