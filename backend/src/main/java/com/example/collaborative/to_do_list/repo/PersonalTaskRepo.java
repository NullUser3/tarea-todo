package com.example.collaborative.to_do_list.repo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.collaborative.to_do_list.dto.task.TaskDto.RecurrenceRule;
import com.example.collaborative.to_do_list.model.PersonalList;
import com.example.collaborative.to_do_list.model.PersonalTask;

public interface PersonalTaskRepo extends JpaRepository<PersonalTask,UUID>{
    long countByList(PersonalList list);

    @Query("select max(l.position) from PersonalTask l where l.createdBy.id = :userId")
    Optional<Integer> findMaxPosition(@Param("userId") UUID userId);

    List<PersonalTask> findAllByListIdAndCreatedById(UUID listId, UUID userId);
    List<PersonalTask> findAllByCreatedById(UUID userId);

    @Modifying
    @Query("UPDATE PersonalTask pl SET pl.position = pl.position - 1 WHERE pl.createdBy.id = :userId AND pl.position > :positionId")
    void decrementPositionsGreaterThenPositionId(@Param("userId") UUID userId,@Param("positionId") int positionId);

    List<PersonalTask> findAllByListIsNullAndCreatedById(UUID userId);

    List<PersonalTask> findByRecurrenceRule(RecurrenceRule rule);

    List<PersonalTask> findAllByRecurrenceRuleIn(List<RecurrenceRule> rules);

     
}
