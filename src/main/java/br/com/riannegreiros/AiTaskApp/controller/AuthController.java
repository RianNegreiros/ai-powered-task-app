package br.com.riannegreiros.AiTaskApp.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.riannegreiros.AiTaskApp.dto.RegisterRequest;
import br.com.riannegreiros.AiTaskApp.dto.RegisterResponse;
import br.com.riannegreiros.AiTaskApp.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  public UserService userService;

  public AuthController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping
  public RegisterResponse userRegistration(@RequestBody RegisterRequest request) {
    RegisterResponse newUser = userService.saveUser(request);

    return newUser;
  }
}
