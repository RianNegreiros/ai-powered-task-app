package br.com.riannegreiros.AiTaskApp.tasks.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.riannegreiros.AiTaskApp.tasks.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByUserId(Long userId);

    List<Task> findByUserIdAndCreatedAtAfter(Long userId, LocalDateTime from);

    Optional<Task> findByIdAndUserId(Long id, Long userId);
}
