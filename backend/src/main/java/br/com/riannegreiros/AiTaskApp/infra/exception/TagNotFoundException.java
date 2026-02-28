package br.com.riannegreiros.AiTaskApp.infra.exception;

public class TagNotFoundException extends RuntimeException {
    public TagNotFoundException(String message) {
        super(message);
    }
}
