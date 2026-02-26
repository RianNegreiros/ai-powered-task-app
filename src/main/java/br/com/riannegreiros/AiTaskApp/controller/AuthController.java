package br.com.riannegreiros.AiTaskApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.riannegreiros.AiTaskApp.dto.LoginRequest;
import br.com.riannegreiros.AiTaskApp.dto.LoginResponse;
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
  public ResponseEntity<RegisterResponse> registration(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse newUser = userService.saveUser(request);

        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = userService.authenticateUser(request);

        return ResponseEntity.ok(loginResponse);
    }
}
