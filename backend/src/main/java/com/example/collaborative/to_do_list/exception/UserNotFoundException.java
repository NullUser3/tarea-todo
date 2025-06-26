package com.example.collaborative.to_do_list.exception;

import java.util.UUID;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(UUID userId) {
        super("User not found with ID:" + userId);
    }
}
