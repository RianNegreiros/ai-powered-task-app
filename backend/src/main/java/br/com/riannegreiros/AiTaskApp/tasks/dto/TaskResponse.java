package br.com.riannegreiros.AiTaskApp.tasks.dto;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import br.com.riannegreiros.AiTaskApp.tasks.model.Priority;

public record TaskResponse(String id, String userId, String title, Priority priority,
        OffsetDateTime dueDate, Boolean completed, String tag, String description,
        LocalDateTime createdAt, LocalDateTime updatedAt) {
}
