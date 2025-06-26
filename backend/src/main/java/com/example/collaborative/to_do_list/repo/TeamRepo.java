package com.example.collaborative.to_do_list.repo;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.collaborative.to_do_list.model.Team;

public interface TeamRepo extends JpaRepository<Team,UUID>{
    
}
