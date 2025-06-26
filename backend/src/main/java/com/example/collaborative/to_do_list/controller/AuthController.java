package com.example.collaborative.to_do_list.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.collaborative.to_do_list.adapter.UserAdapter;
import com.example.collaborative.to_do_list.dto.LoginRequest;
import com.example.collaborative.to_do_list.dto.user.UserResponse;
import com.example.collaborative.to_do_list.service.JwtService;
import com.example.collaborative.to_do_list.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class AuthController {
    
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,HttpServletResponse response) {
        return userService.verify(loginRequest,response);
    }

    @PostMapping("/refresh-token")
public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
    String refreshToken = null;

    // Get refresh token from cookie
    if (request.getCookies() != null) {
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("refreshToken")) {
                refreshToken = cookie.getValue();
            }
        }
    }

    if (refreshToken == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token missing");
    }

    // Validate refresh token
    if (!jwtService.isTokenValid(refreshToken)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
    }

    // Extract username from refresh token
    String username = jwtService.extractUsername(refreshToken);

    // Generate new access token
    String newAccessToken = jwtService.generateToken(username, Map.of());

    // Return new token
    return ResponseEntity.ok(Map.of("token", newAccessToken));
}

@PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletResponse response) {
    Cookie refreshTokenCookie = new Cookie("refreshToken", null);
    refreshTokenCookie.setHttpOnly(true);
    refreshTokenCookie.setSecure(true);
    refreshTokenCookie.setPath("/");
    refreshTokenCookie.setMaxAge(0); // <-- this deletes the cookie immediately
    response.addCookie(refreshTokenCookie);

    return ResponseEntity.ok().body("Logged out successfully");
}

@GetMapping("/auth-user")
public ResponseEntity<UserResponse> getAuthUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();
    UserResponse userResponse = UserResponse.in(userDetails.getUser());
    return ResponseEntity.ok(userResponse);
}



}
