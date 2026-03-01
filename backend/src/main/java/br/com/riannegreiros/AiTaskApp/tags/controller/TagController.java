package br.com.riannegreiros.AiTaskApp.tags.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.riannegreiros.AiTaskApp.tags.Service.TagService;
import br.com.riannegreiros.AiTaskApp.tags.model.dto.TagRequest;
import br.com.riannegreiros.AiTaskApp.tags.model.dto.TagResponse;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestBody TagRequest request, JwtAuthenticationToken token) {
        return ResponseEntity.ok(tagService.createTag(request, token));
    }

    @GetMapping("/me")
    public ResponseEntity<List<TagResponse>> getUserTags(JwtAuthenticationToken token) {
        return ResponseEntity.ok(tagService.listTags(token));
    }

    @DeleteMapping("/me/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable String id, JwtAuthenticationToken token) {
        tagService.deleteTag(id, token);
        return ResponseEntity.noContent().build();
    }
}
