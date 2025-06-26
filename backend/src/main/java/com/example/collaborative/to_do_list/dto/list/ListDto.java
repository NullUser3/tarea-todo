package com.example.collaborative.to_do_list.dto.list;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import com.example.collaborative.to_do_list.model.PersonalList;
import com.example.collaborative.to_do_list.model.Team;
import com.example.collaborative.to_do_list.model.TeamList;
import com.example.collaborative.to_do_list.model.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ListDto {
    public record PersonalListRequest(
        UUID id,
    @NotBlank(message = "Name cannot be blank")
    String name,
    @Pattern(
        regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
        message = "Color must be a valid HEX format (#RGB or #RRGGBB)"
    )
    String color,
    int position,
    User createdBy
    ) {}

    public record PersonalListId(
        UUID listId
    ) {}

    public record UpdateListRequest(
    String name,
    @Pattern(
        regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
        message = "Color must be a valid HEX format (#RGB or #RRGGBB)"
    )
    String color
    ) {
    
}

    public record PersonalListResponse(
        UUID id,
    String name,
    String color,
    int position,
    LocalDateTime createdAt,
    LocalDateTime UpdatedAt
    ) {
        public static PersonalListResponse from(PersonalList list){
            return new PersonalListResponse(
            list.getId(),
            list.getName(),
            list.getColor(),
            list.getPosition(),
            list.getCreatedAt(),
            list.getUpdatedAt());
        }
    }

    public record PersonalListResponseAndCount(UUID id,
    String name,
    String color,
    int position,
    long taskCount,
    LocalDateTime createdAt,
    LocalDateTime UpdatedAt) {
        public static PersonalListResponseAndCount from(PersonalList list,long taskCount){
            return new PersonalListResponseAndCount(
            list.getId(),
            list.getName(),
            list.getColor(),
            list.getPosition(),
            taskCount,
            list.getCreatedAt(),
            list.getUpdatedAt());
    }
    }

    public record TeamListRequest(
    @NotBlank(message = "Name cannot be blank")
    String name,
    @Pattern(
        regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
        message = "Color must be a valid HEX format (#RGB or #RRGGBB)"
    )
    String color,
    int position,
    User createdBy,
    Team team
    ) {}

    public record TeamListResponse(
        UUID id,
    String name,
    String color,
    int position,
    LocalDateTime createdAt,
    TeamSummary team
    ) {
     public static TeamListResponse from(TeamList list){
            Objects.requireNonNull(list.getTeam(), "Team cannot be null");
        Objects.requireNonNull(list.getCreatedBy(), "Creator cannot be null");
            return new TeamListResponse(
            list.getId(),
            list.getName(),
            list.getColor(),
            list.getPosition(),
            list.getCreatedAt(),
            new TeamSummary(list.getTeam().getId(),list.getTeam().getName(),list.getTeam().getMembers().stream()
            .map(user -> new UserSummary(user.getUser().getId(), user.getUser().getUsername()))
            .toList())
            );
        }   
    }

    public record UserSummary(UUID id,String username) {}
    public record TeamSummary(UUID id,String name,List<UserSummary> member) {}
}
