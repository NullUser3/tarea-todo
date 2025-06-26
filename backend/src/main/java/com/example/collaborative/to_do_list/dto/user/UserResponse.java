package com.example.collaborative.to_do_list.dto.user;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.collaborative.to_do_list.model.User;

public record UserResponse(
    UUID id,           
    String username,
    String email,
    String ImageUrl
) {
    public static UserResponse in(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl()
        );
    }

}
