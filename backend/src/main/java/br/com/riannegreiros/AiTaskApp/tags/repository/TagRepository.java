package br.com.riannegreiros.AiTaskApp.tags.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.riannegreiros.AiTaskApp.tags.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findAllByUserId(Long userId);

    Optional<Tag> findByIdAndUserId(Long id, Long userId);
}
