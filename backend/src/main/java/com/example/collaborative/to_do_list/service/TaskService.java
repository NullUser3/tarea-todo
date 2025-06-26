package com.example.collaborative.to_do_list.service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.collaborative.to_do_list.adapter.UserAdapter;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListId;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListResponse;
import com.example.collaborative.to_do_list.dto.task.TaskDto.PersonalTaskRequest;
import com.example.collaborative.to_do_list.dto.task.TaskDto.PersonalTaskResponse;
import com.example.collaborative.to_do_list.dto.task.TaskDto.RecurrenceRule;
import com.example.collaborative.to_do_list.dto.task.TaskDto.UpdateTaskRequest;
import com.example.collaborative.to_do_list.exception.ResourceNotFoundException;
import com.example.collaborative.to_do_list.exception.UserNotFoundException;
import com.example.collaborative.to_do_list.model.PersonalList;
import com.example.collaborative.to_do_list.model.PersonalTask;
import com.example.collaborative.to_do_list.model.User;
import com.example.collaborative.to_do_list.repo.PersonalListRepo;
import com.example.collaborative.to_do_list.repo.PersonalTaskRepo;
import com.example.collaborative.to_do_list.repo.UserRepo;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final PersonalTaskRepo personalTaskRepo;
    private final UserRepo userRepo;
    private final PersonalListRepo personalListRepo;


    @Transactional
    public PersonalTaskResponse createPersonalTask(PersonalTaskRequest personalTaskRequest,Authentication authentication){

        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();

        User creator = userRepo.findById(userDetails.getId())
        .orElseThrow(()-> new UserNotFoundException(userDetails.getId()));

        int newPosition = personalTaskRepo.findMaxPosition(creator.getId()).orElse(0)+1;

        PersonalList list=null;

        if(personalTaskRequest.listId()!=null){
        list = personalListRepo.findById(personalTaskRequest.listId())
        .orElseThrow(()-> new ResourceNotFoundException(personalTaskRequest.listId()));
        }
        

        PersonalTask personalTask = PersonalTask.builder()
        .title(personalTaskRequest.title())
        .description(personalTaskRequest.description())
        .dueDate(personalTaskRequest.dueDate())
        .reminderAt(personalTaskRequest.reminderAt())
        .list(list)
        .createdBy(creator)
        .recurrenceRule(personalTaskRequest.recurrenceRule())
        .nextRecurrence(personalTaskRequest.nextRecurrence())
        .position(newPosition)
        .build();

        return PersonalTaskResponse.from(personalTaskRepo.save(personalTask));
    }

    @Transactional
    public List<PersonalTaskResponse> getPersonalTasksByListId(PersonalListId request,Authentication authentication){
        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();

        List<PersonalTask> tasks = personalTaskRepo.findAllByListIdAndCreatedById(request.listId(),userDetails.getId());

        List<PersonalTaskResponse> responses = new ArrayList<>();
       for(PersonalTask task:tasks){
        responses.add(PersonalTaskResponse.from(task));
       }
       return responses;
    }

    @Transactional
    public void deletePersonalTaskById(UUID id,Authentication authentication){
       UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();
       PersonalTask task = personalTaskRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));

       if(!task.getCreatedBy().getId().equals(userDetails.getId())){
            throw new AccessDeniedException("You don't own this list.");
        }

        personalTaskRepo.decrementPositionsGreaterThenPositionId(task.getCreatedBy().getId(), task.getPosition());

        personalTaskRepo.delete(task);
    }

    @Transactional
    public PersonalTaskResponse updatePersonalTask(UUID id,UpdateTaskRequest request,Authentication authentication){
        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();
        PersonalTask task = personalTaskRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException(id));
        if(!task.getCreatedBy().getId().equals(userDetails.getId())){
            throw new AccessDeniedException("You don't own this list.");
        }
            if (request.listId() != null) {
        PersonalList list = personalListRepo.findById(request.listId())
            .orElseThrow(() -> new ResourceNotFoundException(request.listId()));
        task.setList(list);
        System.out.println("the given list is :"+list);
    } else {
        // Explicitly keep the existing list if not provided
        // task.setList(task.getList()); // This line is technically not needed as it's already set
    }
        if(request.title() != null){
        task.setTitle(request.title());
        }
        if(request.description() != null){
            task.setDescription(request.description());
        }
        if(request.dueDate() != null){
            task.setDueDate(request.dueDate());
        }
        if(request.recurrenceRule() != null){
            task.setRecurrenceRule(request.recurrenceRule());
        }
        if(request.reminderAt() != null){
            task.setReminderAt(request.reminderAt());
        }
        if(request.isCompleted() != null){
task.setCompleted(request.isCompleted());
        }
        

        return PersonalTaskResponse.from(task);
        
    }

    @Transactional
    public List<PersonalTaskResponse> getAllPersonalTasks(Authentication authentication){
        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();
        List<PersonalTask> tasks = personalTaskRepo.findAllByCreatedById(userDetails.getId());
        return tasks.stream()
        .map(task -> PersonalTaskResponse.from(task))
        .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 * * * *") // every hour; adjust as needed
public void resetRecurringTasks() {
    List<PersonalTask> tasks = personalTaskRepo.findAllByRecurrenceRuleIn(
        List.of(RecurrenceRule.DAILY, RecurrenceRule.WEEKLY, RecurrenceRule.MONTHLY)
    );

    LocalDateTime now = LocalDateTime.now();
    System.out.println("Now: " + now);

    for (PersonalTask task : tasks) {
        if (task.isCompleted() && task.getDueDate().isBefore(now)) {
            System.out.println("Resetting task: " + task.getTitle() + " (" + task.getRecurrenceRule() + ")");

            task.setCompleted(false);

            // Advance dueDate based on recurrence rule
            switch (task.getRecurrenceRule()) {
                case DAILY -> task.setDueDate(task.getDueDate().plusDays(1));
                case WEEKLY -> task.setDueDate(task.getDueDate().plusWeeks(1));
                case MONTHLY -> task.setDueDate(task.getDueDate().plusMonths(1));
            }

            personalTaskRepo.save(task);
        }
    }
}


}

