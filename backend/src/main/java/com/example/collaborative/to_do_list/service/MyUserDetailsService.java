package com.example.collaborative.to_do_list.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.collaborative.to_do_list.adapter.UserAdapter;
import com.example.collaborative.to_do_list.model.User;
import com.example.collaborative.to_do_list.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;
    
    @Override
    public UserDetails loadUserByUsername(String loginInput) throws UsernameNotFoundException {
            User user = userRepo.findByUsername(loginInput)
            .or(()->userRepo.findByEmail(loginInput))
            .orElseThrow(()-> new UsernameNotFoundException("user not found :"+loginInput));

        System.out.println("User loaded: " + user.getUsername() + ", Password: " + user.getPasswordHash());
        return new UserAdapter(user);
    }

    
}
