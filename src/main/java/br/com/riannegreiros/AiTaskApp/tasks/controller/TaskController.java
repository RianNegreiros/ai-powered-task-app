package br.com.riannegreiros.AiTaskApp.tasks.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskResponse;
import br.com.riannegreiros.AiTaskApp.tasks.service.TaskService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request,
            JwtAuthenticationToken token) {
        TaskResponse response = taskService.saveTask(request, token);

        return ResponseEntity.ok(response);
    }
}
