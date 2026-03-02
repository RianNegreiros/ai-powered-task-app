package br.com.riannegreiros.AiTaskApp.reports.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.com.riannegreiros.AiTaskApp.reports.model.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByUserId(Long userId);

    boolean existsByUserIdAndCreatedAtAfter(Long userId, LocalDateTime from);

    @Query("SELECT r FROM Report r WHERE r.user.id = :userId ORDER BY r.createdAt DESC LIMIT 1")
    Report findLastReportByUserId(@Param("userId") Long userId);
}
