package com.example.collaborative.to_do_list.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoginRequest{
    private String usernameOrEmail;
    private String password; 
}
