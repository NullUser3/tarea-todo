package com.example.collaborative.to_do_list.repo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.collaborative.to_do_list.model.PersonalList;

public interface PersonalListRepo extends JpaRepository<PersonalList,UUID>{

    @Query("select pl from PersonalList pl where pl.createdBy.id = :userId and pl.deletedAt is null order by pl.position asc")
    List<PersonalList> findByCreatedByIdSortedAsc(@Param("userId") UUID userId);

    @Query("select max(l.position) from PersonalList l where l.createdBy.id = :userId")
    Optional<Integer> findMaxPosition(@Param("userId") UUID userId);

    

    @Modifying
    @Query("UPDATE PersonalList pl SET pl.position = pl.position - 1 WHERE pl.createdBy.id = :userId AND pl.position BETWEEN :start AND :end")
    void decrementPositionsInRange(@Param("userId") UUID userId, @Param("start") int start, @Param("end") int end);

    @Modifying
    @Query("UPDATE PersonalList pl SET pl.position = pl.position - 1 WHERE pl.createdBy.id = :userId AND pl.position > :positionId")
    void decrementPositionsGreaterThenPositionId(@Param("userId") UUID userId,@Param("positionId") int positionId);


    @Modifying
    @Query("UPDATE PersonalList pl SET pl.position = pl.position + 1 WHERE pl.createdBy.id = :userId AND pl.position BETWEEN :start AND :end")
    void incrementPositionsInRange(@Param("userId") UUID userId, @Param("start") int start, @Param("end") int end);


    @Query("SELECT l FROM PersonalList l LEFT JOIN FETCH l.tasks WHERE l.createdBy.id = :userId AND l.deletedAt IS NULL ORDER BY l.position ASC")
    List<PersonalList> findByCreatedByIdWithTasks(@Param("userId") UUID userId);
}
