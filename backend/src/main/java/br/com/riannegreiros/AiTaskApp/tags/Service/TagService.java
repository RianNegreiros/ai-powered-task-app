package br.com.riannegreiros.AiTaskApp.tags.Service;

import java.util.List;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.infra.exception.TagNotFoundException;
import br.com.riannegreiros.AiTaskApp.infra.exception.UserNotFoundException;
import br.com.riannegreiros.AiTaskApp.tags.model.Tag;
import br.com.riannegreiros.AiTaskApp.tags.model.dto.TagRequest;
import br.com.riannegreiros.AiTaskApp.tags.model.dto.TagResponse;
import br.com.riannegreiros.AiTaskApp.tags.model.repository.TagRepository;

@Service
public class TagService {
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public TagService(TagRepository tagRepository, UserRepository userRepository) {
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
    }

    public TagResponse createTag(TagRequest request, JwtAuthenticationToken token) {
        User user = getUser(token);
        Tag tag = tagRepository.save(new Tag(request.name(), user));
        return toResponse(tag);
    }

    public List<TagResponse> listTags(JwtAuthenticationToken token) {
        User user = getUser(token);
        return tagRepository.findAllByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteTag(String id, JwtAuthenticationToken token) {
        tagRepository.delete(tagRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TagNotFoundException("Tag not found with ID: " + id)));
    }

    private User getUser(JwtAuthenticationToken token) {
        return userRepository.findById(Long.parseLong(token.getName()))
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + token.getName()));
    }

    private TagResponse toResponse(Tag tag) {
        return new TagResponse(tag.getId().toString(), tag.getName());
    }
}
