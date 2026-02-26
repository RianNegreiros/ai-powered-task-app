package br.com.riannegreiros.AiTaskApp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import br.com.riannegreiros.AiTaskApp.dto.RegisterRequest;
import br.com.riannegreiros.AiTaskApp.dto.RegisterResponse;
import br.com.riannegreiros.AiTaskApp.model.User;
import br.com.riannegreiros.AiTaskApp.repository.UserRepository;

@Service
public class UserService {
  private UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @PostMapping
  public RegisterResponse saveUser(RegisterRequest request) {
    User userExists = userRepository.findByEmail(request.email());
    if (userExists != null) {
      throw new RuntimeException("User with email " + request.email() + " already exists");
    }

    User user = new User();
    user.setName(request.name());
    user.setEmail(request.email());
    user.setPassword(request.password());

    User newUser = userRepository.save(user);

    return new RegisterResponse(newUser.getName(), newUser.getEmail());
  }
}
