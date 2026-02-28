package br.com.riannegreiros.AiTaskApp.tasks.service;

import java.util.List;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.infra.exception.TaskNotFoundException;
import br.com.riannegreiros.AiTaskApp.infra.exception.UserNotFoundException;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskResponse;
import br.com.riannegreiros.AiTaskApp.tasks.dto.UpdateTaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.model.Task;
import br.com.riannegreiros.AiTaskApp.tasks.repository.TaskRepository;

@Service
public class TaskService {
    private TaskRepository taskRepository;
    private UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public TaskResponse saveTask(TaskRequest request, JwtAuthenticationToken token) {
        User user = userRepository.findById(token.getName());

        if (user == null) {
            throw new UserNotFoundException("User not found with ID: " + token.getName());
        }

        Task task = new Task();
        task.setTitle(request.title());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setTag(request.tag());
        task.setDescription(request.description());
        task.setUser(user);

        taskRepository.save(task);

        return new TaskResponse(task.getId().toString(), user.getId().toString(), task.getTitle(),
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getTag(),
                task.getDescription(), task.getCreatedAt(), task.getUpdatedAt());
    }

    public List<TaskResponse> listAllUserTasks(JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        return taskRepository.findAllByUserId(user.getId()).stream()
                .map(task -> new TaskResponse(task.getId().toString(), user.getId().toString(),
                        task.getTitle(), task.getPriority(), task.getDueDate(), task.isCompleted(),
                        task.getTag(), task.getDescription(), task.getCreatedAt(),
                        task.getUpdatedAt()))
                .toList();
    }

    public TaskResponse getTask(String taskId, JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Task task = taskRepository.findById(Long.parseLong(taskId))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + taskId));

        return new TaskResponse(task.getId().toString(), user.getId().toString(), task.getTitle(),
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getTag(),
                task.getDescription(), task.getCreatedAt(), task.getUpdatedAt());
    }

    public TaskResponse updateTask(UpdateTaskRequest request, JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Task task = taskRepository.findById(Long.parseLong(request.id())).orElseThrow(
                () -> new TaskNotFoundException("Task not found with ID: " + request.id()));

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setPriority(request.priority());
        task.setTag(request.tag());

        taskRepository.save(task);

        return new TaskResponse(task.getId().toString(), user.getId().toString(), task.getTitle(),
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getTag(),
                task.getDescription(), task.getCreatedAt(), task.getUpdatedAt());
    }

    public void deleteTask(String id, JwtAuthenticationToken token) {
        userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Task task = taskRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + id));

        taskRepository.delete(task);
    }

    public TaskResponse toggleTaskCompleted(String id, JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Task task = taskRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + id));

        task.toggleTaskCompleted();
        taskRepository.save(task);

        return new TaskResponse(task.getId().toString(), user.getId().toString(), task.getTitle(),
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getTag(),
                task.getDescription(), task.getCreatedAt(), task.getUpdatedAt());
    }
}
