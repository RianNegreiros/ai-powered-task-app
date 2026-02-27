package br.com.riannegreiros.AiTaskApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.riannegreiros.AiTaskApp.dto.AuthResponse;
import br.com.riannegreiros.AiTaskApp.dto.LoginRequest;
import br.com.riannegreiros.AiTaskApp.dto.RefreshTokenRequest;
import br.com.riannegreiros.AiTaskApp.dto.RegisterRequest;
import br.com.riannegreiros.AiTaskApp.dto.RegisterResponse;
import br.com.riannegreiros.AiTaskApp.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse newUser = userService.saveUser(request);

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse loginResponse = userService.authenticateUser(request);

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        AuthResponse response = userService.refreshToken(request.refreshToken());

        return ResponseEntity.ok(response);
    }
}
