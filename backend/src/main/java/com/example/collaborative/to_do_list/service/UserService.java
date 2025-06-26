package com.example.collaborative.to_do_list.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.collaborative.to_do_list.adapter.UserAdapter;
import com.example.collaborative.to_do_list.dto.LoginRequest;
import com.example.collaborative.to_do_list.dto.user.UserRequest;
import com.example.collaborative.to_do_list.dto.user.UserResponse;
import com.example.collaborative.to_do_list.exception.ConflictException;
import com.example.collaborative.to_do_list.model.User;
import com.example.collaborative.to_do_list.repo.UserRepo;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Transactional
    public User createUser(UserRequest userRequest) {
        if(userRepo.existsByEmail(userRequest.email())){
            throw new ConflictException("email already exists");
        }
        if(userRepo.existsByUsername(userRequest.username())){  // Use existsByUsername here
            throw new ConflictException("username already exists");
        }
        User user = User.builder()
                .username(userRequest.username())
                .email(userRequest.email())
                .passwordHash(passwordEncoder.encode(userRequest.password()))
                .build();
        return userRepo.save(user);
    }

    // Find user by ID
    public User findById(UUID id) throws Exception {
        return userRepo.findById(id)
                .orElseThrow(() -> new Exception("User not found"));
    }


    // Authenticate login, generate tokens, and return response
    public ResponseEntity<?> verify(LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getPassword()
                    )
            );

            // If successful, get authenticated user details
            UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();

            // Generate access token
            String token = jwtService.generateToken(
                    userDetails.getUsername(),
                    Map.of("userId", userDetails.getUser().getId())  // You'll need to add getUser() method in UserAdapter
            );

            // Generate refresh token
            String refreshToken = jwtService.generateRefreshToken(userDetails.getUsername());

            // Send refresh token as HttpOnly cookie
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(true) // set false locally if no HTTPS
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60) // 7 days
                    .sameSite("Strict")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            // Return access token and user info in response body
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", userDetails.getUsername()
            )
            );

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication failed");
        }
    }
}
