package com.example.collaborative.to_do_list.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.collaborative.to_do_list.dto.user.UserRequest;
import com.example.collaborative.to_do_list.dto.user.UserResponse;
import com.example.collaborative.to_do_list.model.User;
import com.example.collaborative.to_do_list.repo.UserRepo;
import com.example.collaborative.to_do_list.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;


@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private UserRepo userRepo;
    @PostMapping("/createUser")
    public ResponseEntity<User> createUserController(@RequestBody @Valid UserRequest userRequest) {
       User user = userService.createUser(userRequest);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<UserResponse> getMethodName(@PathVariable UUID id) throws Exception {
        User user = userService.findById(id);
        UserResponse userResponse = UserResponse.in(user);
        return ResponseEntity.ok(userResponse);
    }
    
    @GetMapping("/getUsers")
    public List<User> getUsers() {
        
        List<User> user = userRepo.findAll();
        return user;
    }
    
}
