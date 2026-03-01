package br.com.riannegreiros.AiTaskApp.auth.service;

import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import br.com.riannegreiros.AiTaskApp.auth.dto.AuthResponse;
import br.com.riannegreiros.AiTaskApp.auth.dto.LoginRequest;
import br.com.riannegreiros.AiTaskApp.auth.dto.RegisterRequest;
import br.com.riannegreiros.AiTaskApp.auth.dto.RegisterResponse;
import br.com.riannegreiros.AiTaskApp.auth.dto.UserResponse;
import br.com.riannegreiros.AiTaskApp.auth.model.User;
import br.com.riannegreiros.AiTaskApp.auth.repository.UserRepository;
import br.com.riannegreiros.AiTaskApp.infra.exception.InvalidCredentialsException;
import br.com.riannegreiros.AiTaskApp.infra.exception.UserAlreadyExistsException;
import br.com.riannegreiros.AiTaskApp.infra.exception.UserNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserService {
    @Value("${jwt.issuer}")
    private String jwtIssuer;

    @Value("${jwt.token-expiry}")
    private Long tokenExpiresIn;

    @Value("${jwt.refresh-token-expiry}")
    private Long refreshTokenExpiresIn;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder, JwtDecoder jwtDecoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    @Transactional
    public RegisterResponse saveUser(RegisterRequest request) {
        User userExists = userRepository.findByEmail(request.email());
        if (userExists != null) {
            throw new UserAlreadyExistsException(
                    "User with email " + request.email() + " already exists");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        User newUser = userRepository.save(user);
        return toRegisterResponse(newUser);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.email());

        if (user == null || !isLoginPasswordCorrect(request, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return toAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        try {
            var jwt = jwtDecoder.decode(refreshToken);

            String userId = jwt.getSubject();
            User user = userRepository.findById(userId);

            if (user == null) {
                throw new InvalidCredentialsException("User not found for this refresh token");
            }

            String tokenType = jwt.getClaimAsString("type");
            if (!"refresh".equals(tokenType)) {
                throw new InvalidCredentialsException("Token is not a refresh token");
            }

            return toAuthResponse(user);
        } catch (InvalidCredentialsException e) {
            throw e;
        } catch (JwtException e) {
            throw new InvalidCredentialsException("Invalid or expired refresh token");
        }
    }

    public UserResponse getUserInfo(JwtAuthenticationToken token) {
        User user = userRepository.findById(Long.parseLong(token.getName())).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + token.getName()));
        return toUserResponse(user);
    }

    private String generateJwt(User user, Long expiresIn, String type) {
        var now = Instant.now();
        var claims = JwtClaimsSet.builder().issuer("ai-powered-task-app")
                .subject(user.getId().toString()).issuedAt(now).claim("type", type)
                .expiresAt(now.plusSeconds(expiresIn)).build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    private boolean isLoginPasswordCorrect(LoginRequest request, String userPassword) {
        return passwordEncoder.matches(request.password(), userPassword);
    }

    private RegisterResponse toRegisterResponse(User user) {
        return new RegisterResponse(user.getName(), user.getEmail());
    }

    private AuthResponse toAuthResponse(User user) {
        var tokenValue = generateJwt(user, tokenExpiresIn, "access");
        var refreshTokenValue = generateJwt(user, refreshTokenExpiresIn, "refresh");
        return new AuthResponse(tokenValue, tokenExpiresIn, refreshTokenValue, refreshTokenExpiresIn);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId().toString(), user.getName(), user.getEmail());
    }
}
