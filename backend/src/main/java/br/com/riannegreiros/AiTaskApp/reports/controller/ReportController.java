package br.com.riannegreiros.AiTaskApp.reports.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.riannegreiros.AiTaskApp.reports.dto.ReportResponse;
import br.com.riannegreiros.AiTaskApp.reports.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReportResponse>> getUserReports(JwtAuthenticationToken token) {
        return ResponseEntity.ok(reportService.listAllUserReports(token));
    }

    @GetMapping("/me/latest")
    public ResponseEntity<ReportResponse> getUserLatestReport(JwtAuthenticationToken token) {
        return ResponseEntity.ok(reportService.getUserLastReport(token));
    }
}
