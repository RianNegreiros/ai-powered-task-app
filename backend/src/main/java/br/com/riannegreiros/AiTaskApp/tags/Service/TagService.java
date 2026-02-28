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
    private TagRepository tagRepository;
    private UserRepository userRepository;

    public TagService(TagRepository tagRepository, UserRepository userRepository) {
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
    }

    public TagResponse createTag(TagRequest request, JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Tag tag = new Tag(request.name(), user);

        tagRepository.save(tag);

        return new TagResponse(tag.getId().toString(), tag.getName(), user.getId().toString());
    }

    public List<TagResponse> listTags(JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        return tagRepository.findAllByUserId(user.getId()).stream()
                .map(tag -> new TagResponse(tag.getId().toString(), tag.getName(),
                        tag.getUser().getId().toString()))
                .toList();
    }

    public void deleteTag(String id, JwtAuthenticationToken token) {
        userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));

        Tag tag = tagRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new TagNotFoundException("Tag not found with ID: " + id));

        tagRepository.delete(tag);
    }
}
