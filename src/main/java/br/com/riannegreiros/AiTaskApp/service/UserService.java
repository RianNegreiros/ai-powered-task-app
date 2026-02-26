package br.com.riannegreiros.AiTaskApp.service;

import java.time.Instant;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import br.com.riannegreiros.AiTaskApp.dto.LoginRequest;
import br.com.riannegreiros.AiTaskApp.dto.LoginResponse;
import br.com.riannegreiros.AiTaskApp.dto.RegisterRequest;
import br.com.riannegreiros.AiTaskApp.dto.RegisterResponse;
import br.com.riannegreiros.AiTaskApp.model.User;
import br.com.riannegreiros.AiTaskApp.repository.UserRepository;

@Service
public class UserService {
  private UserRepository userRepository;
  private BCryptPasswordEncoder passwordEncoder;
  private JwtEncoder jwtEncoder;

  public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtEncoder jwtEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtEncoder = jwtEncoder;
}

  public RegisterResponse saveUser(RegisterRequest request) {
    User userExists = userRepository.findByEmail(request.email());
    if (userExists != null) {
      throw new RuntimeException("User with email " + request.email() + " already exists");
    }

    User user = new User();
    user.setName(request.name());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));

    User newUser = userRepository.save(user);

    return new RegisterResponse(newUser.getName(), newUser.getEmail());
  }

  public LoginResponse authenticateUser(LoginRequest request) {
    User user = userRepository.findByEmail(request.email());

if (user == null || !user.isLoginPasswordCorrect(request, passwordEncoder)) {
    throw new BadCredentialsException("Invalid email or password");
}

    var now = Instant.now();
    var expiresIn = 1800L;

    var claims = JwtClaimsSet.builder()
        .issuer("ai-powered-task-app")
        .subject(user.getId().toString())
        .issuedAt(now)
        .expiresAt(now.plusSeconds(expiresIn))
        .build();

        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return new LoginResponse(jwtValue, expiresIn);
  }
}
