package br.com.riannegreiros.AiTaskApp.reports.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import br.com.riannegreiros.AiTaskApp.ai.dto.AiResponse;
import br.com.riannegreiros.AiTaskApp.ai.service.AiService;
import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.reports.dto.ReportResponse;
import br.com.riannegreiros.AiTaskApp.reports.model.Report;
import br.com.riannegreiros.AiTaskApp.reports.repository.ReportRepository;
import br.com.riannegreiros.AiTaskApp.tags.model.Tag;
import br.com.riannegreiros.AiTaskApp.tasks.model.Priority;
import br.com.riannegreiros.AiTaskApp.tasks.model.Task;
import br.com.riannegreiros.AiTaskApp.tasks.repository.TaskRepository;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    TaskRepository taskRepository;
    @Mock
    UserRepository userRepository;
    @Mock
    ReportRepository reportRepository;
    @Mock
    AiService aiService;
    @Mock
    JwtAuthenticationToken token;

    @InjectMocks
    ReportService reportService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("john Doe", "johndoe@test.com", "secret");
        user.setId(1L);
    }

    @Test
    void generateReport_whenReportAlreadyGeneratedThisWeek_doesNothing() {
        when(reportRepository.existsByUserIdAndCreatedAtAfter(any(), any(LocalDateTime.class)))
                .thenReturn(true);

        reportService.generateReport(1L);

        verify(aiService, never()).processPrompt(anyString());
        verify(reportRepository, never()).save(any());
    }

    @Test
    void generateReport_whenNoRecentTasks_doesNothing() {
        when(reportRepository.existsByUserIdAndCreatedAtAfter(any(), any(LocalDateTime.class)))
                .thenReturn(false);
        when(taskRepository.findByUserIdAndCreatedAtAfter(any(), any(LocalDateTime.class)))
                .thenReturn(List.of());

        reportService.generateReport(1L);

        verify(aiService, never()).processPrompt(anyString());
        verify(reportRepository, never()).save(any());
    }

    @Test
    void generateReport_withTasks_callsAiAndSavesReport() {
        Task pending = new Task("Write tests", Priority.CRITICAL,
                OffsetDateTime.now().minusDays(1), user, null);
        Task done = new Task("Done task", Priority.LOW, null, user, null);
        done.setCompleted(true);
        pending.setTags(Set.of(new Tag("work", user)));

        when(reportRepository.existsByUserIdAndCreatedAtAfter(any(), any(LocalDateTime.class)))
                .thenReturn(false);
        when(taskRepository.findByUserIdAndCreatedAtAfter(any(), any(LocalDateTime.class)))
                .thenReturn(List.of(pending, done));
        when(aiService.processPrompt(anyString())).thenReturn(new AiResponse("AI summary"));
        when(userRepository.getReferenceById(1L)).thenReturn(user);

        reportService.generateReport(1L);

        ArgumentCaptor<String> prompt = ArgumentCaptor.forClass(String.class);
        verify(aiService).processPrompt(prompt.capture());
        assertThat(prompt.getValue()).contains("Total tasks: 2", "Completed: 1", "Pending: 1",
                "Overdue: 1", "Critical priority pending: 1", "work (1)", "Write tests");

        ArgumentCaptor<Report> saved = ArgumentCaptor.forClass(Report.class);
        verify(reportRepository).save(saved.capture());
        assertThat(saved.getValue().getContent()).isEqualTo("AI summary");
        assertThat(saved.getValue().getUser()).isSameAs(user);
    }

    @Test
    void getUserLastReport_whenExists_returnsResponse() {
        when(token.getName()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Report report = new Report(user, "content");
        report.setId(9L);
        when(reportRepository.findLastReportByUserId(1L)).thenReturn(Optional.of(report));

        Optional<ReportResponse> result = reportService.getUserLastReport(token);

        assertThat(result).isPresent();
        assertThat(result.get().id()).isEqualTo(9L);
        assertThat(result.get().content()).isEqualTo("content");
    }

    @Test
    void getUserLastReport_whenNone_returnsEmpty() {
        when(token.getName()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reportRepository.findLastReportByUserId(1L)).thenReturn(Optional.empty());

        assertThat(reportService.getUserLastReport(token)).isEmpty();
    }

    @Test
    void listAllUserReports_mapsEveryReport() {
        when(token.getName()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Report r1 = new Report(user, "one");
        r1.setId(1L);
        Report r2 = new Report(user, "two");
        r2.setId(2L);
        when(reportRepository.findAllByUserId(1L)).thenReturn(List.of(r1, r2));

        List<ReportResponse> result = reportService.listAllUserReports(token);

        assertThat(result).extracting(ReportResponse::content).containsExactly("one", "two");
    }
}
