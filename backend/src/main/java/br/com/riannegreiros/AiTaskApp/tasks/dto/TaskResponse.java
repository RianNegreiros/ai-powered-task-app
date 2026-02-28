package br.com.riannegreiros.AiTaskApp.tasks.dto;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import br.com.riannegreiros.AiTaskApp.tasks.model.Priority;

public record TaskResponse(String id, String userId, String title, Priority priority,
        OffsetDateTime dueDate, Boolean completed, String description, List<TagSummary> tags,
        LocalDateTime createdAt, LocalDateTime updatedAt) {
}
