package br.com.riannegreiros.AiTaskApp.tags.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    private TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestBody TagRequest request,
            JwtAuthenticationToken token) {
        TagResponse response = tagService.createTag(request, token);

        return ResponseEntity.ok(response);
    }
}
