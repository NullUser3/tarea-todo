package com.example.collaborative.to_do_list.repo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.collaborative.to_do_list.model.User;

@Repository
public interface UserRepo extends JpaRepository<User,UUID> {

    Optional<User> findByUsername(String username);
    

    Optional<User> findByEmail(String email);
    

    boolean existsByUsername(String username);
    

    boolean existsByEmail(String email);
}
