package br.com.riannegreiros.AiTaskApp.infra.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.reports.service.ReportService;

@Component
public class WeeklyReportJob {

    private final UserRepository userRepository;
    private final ReportService reportService;

    public WeeklyReportJob(UserRepository userRepository, ReportService reportService) {
        this.userRepository = userRepository;
        this.reportService = reportService;
    }

    @Scheduled(cron = "0 0 8 * * MON")
    public void generateWeeklyReports() {
        PageRequest pageable = PageRequest.of(0, 20);
        Page<User> page;
        do {
            page = userRepository.findAll(pageable);
            page.forEach(user -> reportService.generateReport(user.getId()));
            pageable = pageable.next();
        } while (page.hasNext());
    }
}
