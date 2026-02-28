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
    public ResponseEntity<TaskResponse> getTask(@PathVariable String id,
            JwtAuthenticationToken token) {
        TaskResponse task = taskService.getTask(id, token);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/me/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable String id,
            @Valid @RequestBody UpdateTaskRequest request, JwtAuthenticationToken token) {
        TaskResponse task = taskService.updateTask(id, request, token);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/me/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable String id,
            JwtAuthenticationToken token) {
        taskService.deleteTask(id, token);
        return ResponseEntity.ok("Task with ID: " + id + " deleted successfully.");
    }

    @PatchMapping("/me/{id}")
    public ResponseEntity<TaskResponse> toggleTaskCompleted(@PathVariable String id,
            JwtAuthenticationToken token) {
        TaskResponse reponse = taskService.toggleTaskCompleted(id, token);
        return ResponseEntity.ok(reponse);
    }
}
