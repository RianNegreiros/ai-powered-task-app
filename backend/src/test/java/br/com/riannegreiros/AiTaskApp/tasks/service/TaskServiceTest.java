package br.com.riannegreiros.AiTaskApp.tasks.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.infra.exception.TagNotFoundException;
import br.com.riannegreiros.AiTaskApp.infra.exception.TaskNotFoundException;
import br.com.riannegreiros.AiTaskApp.tags.repository.TagRepository;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskRequest;
import br.com.riannegreiros.AiTaskApp.tasks.dto.TaskResponse;
import br.com.riannegreiros.AiTaskApp.tasks.model.Priority;
import br.com.riannegreiros.AiTaskApp.tasks.model.Task;
import br.com.riannegreiros.AiTaskApp.tasks.repository.TaskRepository;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    TaskRepository taskRepository;
    @Mock
    UserRepository userRepository;
    @Mock
    TagRepository tagRepository;
    @Mock
    JwtAuthenticationToken token;

    @InjectMocks
    TaskService taskService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("Rian", "rian@test.com", "secret");
        user.setId(1L);
    }

    private void authenticateAsUser() {
        when(token.getName()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    }

    @Test
    void saveTask_createsTaskForAuthenticatedUser() {
        authenticateAsUser();
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> {
            Task t = inv.getArgument(0);
            t.setId(10L);
            return t;
        });

        TaskRequest request = new TaskRequest("Write tests", Priority.HIGH, null, "desc", null);

        TaskResponse response = taskService.saveTask(request, token);

        assertThat(response.id()).isEqualTo("10");
        assertThat(response.userId()).isEqualTo("1");
        assertThat(response.title()).isEqualTo("Write tests");
        assertThat(response.priority()).isEqualTo(Priority.HIGH);
        assertThat(response.completed()).isFalse();
        assertThat(response.tags()).isEmpty();
    }

    @Test
    void saveTask_withTagThatDoesNotBelongToUser_throwsTagNotFound() {
        authenticateAsUser();
        when(tagRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        TaskRequest request = new TaskRequest("Task", Priority.LOW, null, null, List.of("99"));

        assertThatThrownBy(() -> taskService.saveTask(request, token))
                .isInstanceOf(TagNotFoundException.class);
        verify(taskRepository, never()).save(any());
    }

    @Test
    void getTask_whenNotFound_throwsTaskNotFound() {
        authenticateAsUser();
        when(taskRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTask("5", token))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("5");
    }

    @Test
    void toggleTaskCompleted_flipsCompletedFlag() {
        authenticateAsUser();
        Task task = new Task("Task", Priority.LOW, null, user, null);
        task.setId(7L);
        when(taskRepository.findByIdAndUserId(7L, 1L)).thenReturn(Optional.of(task));

        TaskResponse response = taskService.toggleTaskCompleted("7", token);

        assertThat(response.completed()).isTrue();
        verify(taskRepository).save(task);
    }

    @Test
    void deleteTask_deletesTaskOwnedByUser() {
        authenticateAsUser();
        Task task = new Task("Task", Priority.LOW, null, user, null);
        task.setId(7L);
        when(taskRepository.findByIdAndUserId(7L, 1L)).thenReturn(Optional.of(task));

        taskService.deleteTask("7", token);

        verify(taskRepository).delete(task);
    }
}
