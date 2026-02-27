package br.com.riannegreiros.AiTaskApp.tasks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.riannegreiros.AiTaskApp.tasks.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
