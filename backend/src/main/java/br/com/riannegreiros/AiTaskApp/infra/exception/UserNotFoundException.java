package br.com.riannegreiros.AiTaskApp.infra.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
