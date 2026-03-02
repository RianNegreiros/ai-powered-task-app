package br.com.riannegreiros.AiTaskApp.infra.exception;

public class AiServiceException extends RuntimeException {
    public AiServiceException(String message) {
        super(message);
    }
}
