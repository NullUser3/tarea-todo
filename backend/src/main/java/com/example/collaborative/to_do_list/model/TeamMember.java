package com.example.collaborative.to_do_list.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import com.example.collaborative.to_do_list.converters.LowercaseTypeConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "team_members")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamMember {


    @EmbeddedId
    private TeamMemberId id;

    @Column(nullable = false)
    @Convert(converter = LowercaseTypeConverter.class)  // Your custom converter
    private Role role;  // Enum will be handled by LowercaseTypeConverter

    @Column(name = "joined_at", updatable = false)
    @Builder.Default
    private LocalDateTime joinedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("teamId")
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum Role {
        OWNER, ADMIN, MEMBER
    }

        // === Composite Key Class ===
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeamMemberId implements Serializable {
        private UUID teamId;
        private UUID userId;
    }
}
