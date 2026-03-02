package br.com.riannegreiros.AiTaskApp.reports.dto;

import java.time.LocalDateTime;

public record ReportResponse(Long id, String content, LocalDateTime createdAt) {
}
