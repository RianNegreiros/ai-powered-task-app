package br.com.riannegreiros.AiTaskApp.tasks.dto;

import java.time.LocalDateTime;
import br.com.riannegreiros.AiTaskApp.tasks.model.Priority;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(@NotBlank(message = "Id is required") String id,
        @Size(min = 1, max = 255,
                message = "Title must be between 1 and 255 characters") String title,

        Priority priority,

        @Future(message = "Due date must be in the future") LocalDateTime dueDate,

        @Size(max = 50, message = "Tag must not exceed 50 characters") String tag,

        @Size(max = 1000,
                message = "Description must not exceed 1000 characters") String description) {
}
