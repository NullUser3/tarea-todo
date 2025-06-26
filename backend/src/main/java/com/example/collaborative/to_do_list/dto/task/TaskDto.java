package com.example.collaborative.to_do_list.dto.task;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.collaborative.to_do_list.model.PersonalList;
import com.example.collaborative.to_do_list.model.PersonalTask;
import com.example.collaborative.to_do_list.model.User;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TaskDto {
    public record PersonalTaskRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be at most 255 characters")
       String title,

       @Size(max = 1000, message = "Description must be at most 1000 characters")
       String description,

       @FutureOrPresent(message = "Due date must be in the present or future")
       LocalDateTime dueDate,

       @Future(message = "reminder must be in the future")
       LocalDateTime reminderAt,

       UUID listId,
       
       RecurrenceRule recurrenceRule,
       LocalDateTime nextRecurrence
    ) {}

    public record UpdateTaskRequest(
        @Size(max = 255, message = "Title must be at most 255 characters")
       String title,

       @Size(max = 1000, message = "Description must be at most 1000 characters")
       String description,

       @FutureOrPresent(message = "Due date must be in the present or future")
       LocalDateTime dueDate,

       @Future(message = "reminder must be in the future")
       LocalDateTime reminderAt,

       UUID listId,
       
       RecurrenceRule recurrenceRule,
       LocalDateTime nextRecurrence,
       Boolean isCompleted
    ) {
    }

    public record PersonalTaskResponse(
        UUID id,
     String title,
       String description,
       LocalDateTime dueDate,
       LocalDateTime reminderAt,
       UUID listId,
       String listName,
       RecurrenceRule recurrenceRule,
       LocalDateTime nextRecurrence,
       int position,
       LocalDateTime createdAt,
       boolean isCompleted   
    ) {
        public static PersonalTaskResponse from(PersonalTask personalTask){
            PersonalList list = personalTask.getList();
            return new PersonalTaskResponse(personalTask.getId(),personalTask.getTitle()
            , personalTask.getDescription()
            , personalTask.getDueDate()
            , personalTask.getReminderAt()
            , list != null? list.getId():null
            , list != null? list.getName():null
            , personalTask.getRecurrenceRule()
            , personalTask.getNextRecurrence()
            , personalTask.getPosition()
            , personalTask.getCreatedAt()
            , personalTask.isCompleted());
        }
    }


    public enum RecurrenceRule{
    DAILY,
    WEEKLY,
    MONTHLY
    }
}
