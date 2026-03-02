package br.com.riannegreiros.AiTaskApp.reports.service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import br.com.riannegreiros.AiTaskApp.ai.dto.AiResponse;
import br.com.riannegreiros.AiTaskApp.ai.service.AiService;
import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.infra.exception.UserNotFoundException;
import br.com.riannegreiros.AiTaskApp.reports.dto.ReportResponse;
import br.com.riannegreiros.AiTaskApp.reports.model.Report;
import br.com.riannegreiros.AiTaskApp.reports.repository.ReportRepository;
import br.com.riannegreiros.AiTaskApp.tags.model.Tag;
import br.com.riannegreiros.AiTaskApp.tasks.model.Priority;
import br.com.riannegreiros.AiTaskApp.tasks.model.Task;
import br.com.riannegreiros.AiTaskApp.tasks.repository.TaskRepository;

@Service
public class ReportService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final AiService aiService;

    public ReportService(TaskRepository taskRepository, UserRepository userRepository,
            ReportRepository reportRepository, AiService aiService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.aiService = aiService;
    }

    public ReportResponse getUserLastReport(JwtAuthenticationToken token) {
        User user = getUser(token);

        Report report = reportRepository.findLastReportByUserId(user.getId());

        return toResponse(report);
    }

    public List<ReportResponse> listAllUserReports(JwtAuthenticationToken token) {
        User user = getUser(token);
        return reportRepository.findAllByUserId(user.getId()).stream().map(this::toResponse)
                .toList();
    }

    public void generateReport(JwtAuthenticationToken token) {
        User user = getUser(token);

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        boolean alreadyGenerated =
                reportRepository.existsByUserIdAndCreatedAtAfter(user.getId(), sevenDaysAgo);
        if (alreadyGenerated)
            return;

        List<Task> tasks = taskRepository.findByUserIdAndCreatedAtAfter(user.getId(), sevenDaysAgo);

        if (tasks.isEmpty())
            return;

        AiResponse aiResponse = aiService.processPrompt(buildPrompt(tasks));

        Report report = new Report();
        report.setUser(userRepository.getReferenceById(user.getId()));
        report.setContent(aiResponse.report());
        reportRepository.save(report);
    }

    public void generateReport(Long userId) {

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        boolean alreadyGenerated =
                reportRepository.existsByUserIdAndCreatedAtAfter(userId, sevenDaysAgo);
        if (alreadyGenerated)
            return;

        List<Task> tasks = taskRepository.findByUserIdAndCreatedAtAfter(userId, sevenDaysAgo);

        if (tasks.isEmpty())
            return;

        AiResponse aiResponse = aiService.processPrompt(buildPrompt(tasks));

        Report report = new Report();
        report.setUser(userRepository.getReferenceById(userId));
        report.setContent(aiResponse.report());
        reportRepository.save(report);
    }

    private User getUser(JwtAuthenticationToken token) {
        return userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));
    }

    private String buildPrompt(List<Task> tasks) {
        OffsetDateTime now = OffsetDateTime.now();

        long completed = tasks.stream().filter(Task::isCompleted).count();
        long pending = tasks.size() - completed;
        long overdue = tasks.stream().filter(
                t -> !t.isCompleted() && t.getDueDate() != null && t.getDueDate().isBefore(now))
                .count();
        long critical = tasks.stream()
                .filter(t -> !t.isCompleted() && t.getPriority() == Priority.CRITICAL).count();

        Map<String, Long> tagFrequency = tasks.stream().flatMap(t -> t.getTags().stream())
                .collect(Collectors.groupingBy(Tag::getName, Collectors.counting()));

        String pendingTasksList = tasks.stream().filter(t -> !t.isCompleted())
                .map(t -> String.format("  - [%s] %s | Due: %s | Tags: %s", t.getPriority(),
                        t.getTitle(),
                        t.getDueDate() != null ? t.getDueDate().toLocalDate() : "no due date",
                        t.getTags().isEmpty() ? "none"
                                : t.getTags().stream().map(Tag::getName)
                                        .collect(Collectors.joining(", "))))
                .collect(Collectors.joining("\n"));

        return String.format(
                """
                        You are a productivity assistant. Analyze this user's current tasks and provide insights.

                        SUMMARY:
                        - Total tasks: %d
                        - Completed: %d
                        - Pending: %d
                        - Overdue: %d
                        - Critical priority pending: %d
                        - Most used tags: %s

                        PENDING TASKS:
                        %s

                        Based on this, provide:
                        1. A brief overall assessment (1-2 sentences)
                        2. Top 3 priorities the user should focus on right now
                        3. Any deadline risks or warnings
                        4. One motivational tip

                        Be concise, friendly, and actionable. Avoid repeating the raw numbers back.
                        """,
                tasks.size(), completed, pending, overdue, critical,
                tagFrequency.isEmpty() ? "none"
                        : tagFrequency.entrySet().stream()
                                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                                .map(e -> e.getKey() + " (" + e.getValue() + ")")
                                .collect(Collectors.joining(", ")),
                pendingTasksList.isEmpty() ? "  (no pending tasks)" : pendingTasksList);
    }

    private ReportResponse toResponse(Report report) {
        return new ReportResponse(report.getId(), report.getContent(), report.getCreatedAt());
    }
}
