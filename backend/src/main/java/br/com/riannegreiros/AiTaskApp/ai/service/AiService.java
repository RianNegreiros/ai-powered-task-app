package br.com.riannegreiros.AiTaskApp.ai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import br.com.riannegreiros.AiTaskApp.ai.dto.AiResponse;
import br.com.riannegreiros.AiTaskApp.infra.exception.AiServiceException;

@Service
public class AiService {
    private final ChatClient chatClient;

    public AiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public AiResponse processPrompt(String prompt) {
        try {
            String content = chatClient.prompt().user(prompt).call().content();
            return new AiResponse(content);
        } catch (Exception e) {
            throw new AiServiceException("Failed to process AI prompt");
        }
    }
}
