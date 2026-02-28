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
    private TaskRepository taskRepository;
    private UserRepository userRepository;
    private TagRepository tagRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
            TagRepository tagRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
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
        task.setDescription(request.description());
        task.setUser(user);

        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();

            for (String tagId : request.tagIds()) {
                Long longId = Long.parseLong(tagId);
                Tag tag = tagRepository.findById(longId).orElseThrow(() -> new TagNotFoundException(
                        "Tag does not belong to user or do not exist"));
                tags.add(tag);
            }
            task.setTags(tags);
        }

        taskRepository.save(task);

        return new TaskResponse(task.getId().toString(), user.getId().toString(), task.getTitle(),
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getDescription(),
                task.getTags().stream().map(tag -> new TagSummary(tag.getId(), tag.getName())).toList(),
                task.getCreatedAt(), task.getUpdatedAt());
    }

    public List<TaskResponse> listAllUserTasks(JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        return taskRepository.findAllByUserId(user.getId()).stream()
                .map(task -> new TaskResponse(task.getId().toString(), user.getId().toString(),
                        task.getTitle(), task.getPriority(), task.getDueDate(), task.isCompleted(),
                        task.getDescription(),
                        task.getTags().stream().map(tag -> new TagSummary(tag.getId(), tag.getName())).toList(),
                        task.getCreatedAt(), task.getUpdatedAt()))
                .toList();
    }

    public TaskResponse getTask(String taskId, JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Task task = taskRepository.findById(Long.parseLong(taskId))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + taskId));

        return new TaskResponse(task.getId().toString(), user.getId().toString(), task.getTitle(),
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getDescription(),
                task.getTags().stream().map(tag -> new TagSummary(tag.getId(), tag.getName())).toList(),
                task.getCreatedAt(), task.getUpdatedAt());
    }

    public TaskResponse updateTask(String id, UpdateTaskRequest request,
            JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Task task = taskRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID: " + id));

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setPriority(request.priority());

        if (request.tagIds() != null) {
            Set<Tag> tags = new HashSet<>();

            if (!request.tagIds().isEmpty()) {
                for (String tagId : request.tagIds()) {
                    Long longId = Long.parseLong(tagId);
                    Tag tag = tagRepository.findById(longId).orElseThrow(() -> new TagNotFoundException(
                            "Tag does not belong to user or do not exist"));
                    tags.add(tag);
                }
            }
            task.setTags(tags);
        }

        taskRepository.save(task);

        return new TaskResponse(task.getId().toString(), user.getId().toString(), task.getTitle(),
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getDescription(),
                task.getTags().stream().map(tag -> new TagSummary(tag.getId(), tag.getName())).toList(),
                task.getCreatedAt(), task.getUpdatedAt());
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
                task.getPriority(), task.getDueDate(), task.isCompleted(), task.getDescription(),
                task.getTags().stream().map(tag -> new TagSummary(tag.getId(), tag.getName())).toList(),
                task.getCreatedAt(), task.getUpdatedAt());
    }
}
