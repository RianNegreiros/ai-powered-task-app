package br.com.riannegreiros.AiTaskApp.tasks.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/me")
    public ResponseEntity<List<TaskResponse>> listAllUserTasks(JwtAuthenticationToken token) {
        List<TaskResponse> tasks = taskService.listAllUserTasks(token);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/me/{id}")
    public ResponseEntity<TaskResponse> listAllUserTasks(@PathVariable String id,
            JwtAuthenticationToken token) {
        TaskResponse task = taskService.getTask(id, token);
        return ResponseEntity.ok(task);
    }
}
