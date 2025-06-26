package com.example.collaborative.to_do_list.dto.user;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(
    
    UUID id,
    @NotBlank(message = "username cannot be blank...")
    @Size(min = 3,max = 50,message = "username has to be between 3 and 20 charectars...")
    String username,
    @NotBlank(message = "email cannot be blank...")
    @Email(message = "invalid email format...")
    String email,
    @NotBlank(message = "password cannot be blank...")
    @Size(min = 8,message = "password has to be atleast 8 charectars...")
    String password,
    @Size(max=50,message = "name too long...")
    String name)
     {}
