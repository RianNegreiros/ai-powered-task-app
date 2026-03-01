package br.com.riannegreiros.AiTaskApp.tasks.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskResponse;
import br.com.riannegreiros.AiTaskApp.tasks.dto.UpdateTaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.service.TaskService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request,
            JwtAuthenticationToken token) {
        return ResponseEntity.ok(taskService.saveTask(request, token));
    }

    @GetMapping("/me")
    public ResponseEntity<List<TaskResponse>> listAllUserTasks(JwtAuthenticationToken token) {
        return ResponseEntity.ok(taskService.listAllUserTasks(token));
    }

    @GetMapping("/me/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable String id,
            JwtAuthenticationToken token) {
        return ResponseEntity.ok(taskService.getTask(id, token));
    }

    @PutMapping("/me/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable String id,
            @Valid @RequestBody UpdateTaskRequest request, JwtAuthenticationToken token) {
        return ResponseEntity.ok(taskService.updateTask(id, request, token));
    }

    @DeleteMapping("/me/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id,
            JwtAuthenticationToken token) {
        taskService.deleteTask(id, token);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/me/{id}")
    public ResponseEntity<TaskResponse> toggleTaskCompleted(@PathVariable String id,
            JwtAuthenticationToken token) {
        return ResponseEntity.ok(taskService.toggleTaskCompleted(id, token));
    }
}
