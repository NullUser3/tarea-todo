package com.example.collaborative.to_do_list.adapter;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.collaborative.to_do_list.model.User;

//UserAdapter is an adapter that lets you access the authenticated user's data throughout your application after they log in
public class UserAdapter implements UserDetails {

    private final User user;


    public UserAdapter(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();

    }

    public User getUser() {
    return this.user;
}
public UUID getId() {
    return user.getId();
}

    public String getEmail(){
        return user.getEmail();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    public String getName() {
        return user.getName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
}
