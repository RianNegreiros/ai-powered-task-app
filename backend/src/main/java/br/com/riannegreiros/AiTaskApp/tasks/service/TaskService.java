package br.com.riannegreiros.AiTaskApp.tasks.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.infra.exception.TagNotFoundException;
import br.com.riannegreiros.AiTaskApp.infra.exception.TaskNotFoundException;
import br.com.riannegreiros.AiTaskApp.infra.exception.UserNotFoundException;
import br.com.riannegreiros.AiTaskApp.tags.model.Tag;
import br.com.riannegreiros.AiTaskApp.tags.model.repository.TagRepository;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TagSummary;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskResponse;
import br.com.riannegreiros.AiTaskApp.tasks.dto.UpdateTaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.model.Task;
import br.com.riannegreiros.AiTaskApp.tasks.repository.TaskRepository;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
            TagRepository tagRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
    }

    public TaskResponse saveTask(TaskRequest request, JwtAuthenticationToken token) {
        User user = getUser(token);

        Task task = new Task();
        task.setTitle(request.title());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setDescription(request.description());
        task.setUser(user);

        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            task.setTags(getTags(request.tagIds()));
        }

        taskRepository.save(task);
        return toResponse(task);
    }

    public List<TaskResponse> listAllUserTasks(JwtAuthenticationToken token) {
        User user = getUser(token);
        return taskRepository.findAllByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse getTask(String taskId, JwtAuthenticationToken token) {
        getUser(token);
        Task task = taskRepository.findById(Long.parseLong(taskId))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + taskId));
        return toResponse(task);
    }

    public TaskResponse updateTask(String id, UpdateTaskRequest request,
            JwtAuthenticationToken token) {
        getUser(token);
        Task task = taskRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + id));

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setPriority(request.priority());

        if (request.tagIds() != null) {
            task.setTags(request.tagIds().isEmpty() ? new HashSet<>() : getTags(request.tagIds()));
        }

        taskRepository.save(task);
        return toResponse(task);
    }

    public void deleteTask(String id, JwtAuthenticationToken token) {
        getUser(token);
        taskRepository.delete(taskRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + id)));
    }

    public TaskResponse toggleTaskCompleted(String id, JwtAuthenticationToken token) {
        getUser(token);
        Task task = taskRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + id));

        task.toggleTaskCompleted();
        taskRepository.save(task);
        return toResponse(task);
    }

    private User getUser(JwtAuthenticationToken token) {
        return userRepository.findById(Long.parseLong(token.getName()))
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + token.getName()));
    }

    private Set<Tag> getTags(List<String> tagIds) {
        Set<Tag> tags = new HashSet<>();
        for (String tagId : tagIds) {
            Tag tag = tagRepository.findById(Long.parseLong(tagId))
                    .orElseThrow(() -> new TagNotFoundException("Tag does not belong to user or do not exist"));
            tags.add(tag);
        }
        return tags;
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(task.getId().toString(), task.getUser().getId().toString(),
                task.getTitle(), task.getPriority(), task.getDueDate(), task.isCompleted(),
                task.getDescription(),
                task.getTags().stream().map(tag -> new TagSummary(tag.getId(), tag.getName())).toList(),
                task.getCreatedAt(), task.getUpdatedAt());
    }
}
