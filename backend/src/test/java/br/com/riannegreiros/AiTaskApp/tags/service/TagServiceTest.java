package br.com.riannegreiros.AiTaskApp.tags.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.infra.exception.TagNotFoundException;
import br.com.riannegreiros.AiTaskApp.infra.exception.UserNotFoundException;
import br.com.riannegreiros.AiTaskApp.tags.Service.TagService;
import br.com.riannegreiros.AiTaskApp.tags.model.Tag;
import br.com.riannegreiros.AiTaskApp.tags.model.dto.TagRequest;
import br.com.riannegreiros.AiTaskApp.tags.model.dto.TagResponse;
import br.com.riannegreiros.AiTaskApp.tags.repository.TagRepository;

@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @Mock
    TagRepository tagRepository;
    @Mock
    UserRepository userRepository;
    @Mock
    JwtAuthenticationToken token;

    @InjectMocks
    TagService tagService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("John Doe", "johndoe@test.com", "secret");
        user.setId(1L);
    }

    private void authenticateAsUser() {
        when(token.getName()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    }

    private Tag tag(Long id, String name) {
        Tag t = new Tag(name, user);
        t.setId(id);
        return t;
    }

    @Test
    void createTag_savesTagForUserAndReturnsResponse() {
        authenticateAsUser();
        when(tagRepository.save(any(Tag.class))).thenReturn(tag(5L, "work"));

        TagResponse response = tagService.createTag(new TagRequest("work"), token);

        assertThat(response.id()).isEqualTo("5");
        assertThat(response.name()).isEqualTo("work");
    }

    @Test
    void createTag_whenUserDoesNotExist_throwsUserNotFound() {
        when(token.getName()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tagService.createTag(new TagRequest("work"), token))
                .isInstanceOf(UserNotFoundException.class);
        verify(tagRepository, never()).save(any());
    }

    @Test
    void listTags_returnsOnlyTheUsersTags() {
        authenticateAsUser();
        when(tagRepository.findAllByUserId(1L))
                .thenReturn(List.of(tag(1L, "work"), tag(2L, "home")));

        List<TagResponse> result = tagService.listTags(token);

        assertThat(result).extracting(TagResponse::name).containsExactly("work", "home");
    }

    @Test
    void deleteTag_deletesTagOwnedByUser() {
        authenticateAsUser();
        Tag existing = tag(3L, "work");
        when(tagRepository.findByIdAndUserId(3L, 1L)).thenReturn(Optional.of(existing));

        tagService.deleteTag("3", token);

        verify(tagRepository).delete(existing);
    }

    @Test
    void deleteTag_whenNotFoundOrNotOwned_throwsTagNotFound() {
        authenticateAsUser();
        when(tagRepository.findByIdAndUserId(3L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tagService.deleteTag("3", token))
                .isInstanceOf(TagNotFoundException.class);
        verify(tagRepository, never()).delete(any());
    }
}
