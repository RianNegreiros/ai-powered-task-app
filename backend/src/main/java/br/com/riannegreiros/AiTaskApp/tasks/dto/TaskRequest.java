package br.com.riannegreiros.AiTaskApp.tasks.dto;

import java.time.OffsetDateTime;
import java.util.List;
import br.com.riannegreiros.AiTaskApp.tasks.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskRequest(
        @NotBlank(message = "Title is required") @Size(min = 1, max = 255,
                message = "Title must be between 1 and 255 characters") String title,

        Priority priority,

        OffsetDateTime dueDate,

        @Size(max = 1000,
                message = "Description must not exceed 1000 characters") String description,
        List<String> tagIds) {
}
