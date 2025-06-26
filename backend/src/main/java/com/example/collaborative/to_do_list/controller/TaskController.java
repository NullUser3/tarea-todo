package com.example.collaborative.to_do_list.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListId;
import com.example.collaborative.to_do_list.dto.task.TaskDto.PersonalTaskRequest;
import com.example.collaborative.to_do_list.dto.task.TaskDto.PersonalTaskResponse;
import com.example.collaborative.to_do_list.dto.task.TaskDto.UpdateTaskRequest;
import com.example.collaborative.to_do_list.model.PersonalTask;
import com.example.collaborative.to_do_list.service.TaskService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/task")
@AllArgsConstructor
public class TaskController {
    
    private final TaskService taskService;

    @PostMapping("/createPersonalTask")
    public ResponseEntity<PersonalTaskResponse> createPersonalTask(@RequestBody PersonalTaskRequest personalTaskRequest,Authentication authentication) {
        
        PersonalTaskResponse task = taskService.createPersonalTask(personalTaskRequest, authentication);
        
        return ResponseEntity.ok(task);
    }
    
    @PostMapping("/getTasksFromList")
    public List<PersonalTaskResponse> getTasksFromList(@RequestBody PersonalListId personalListId,Authentication authentication) {
        List<PersonalTaskResponse> responses = taskService.getPersonalTasksByListId(personalListId, authentication);
        return responses;
    }

    @PutMapping("/updateTask/{id}")
    public ResponseEntity<PersonalTaskResponse> updatePersonalTask(@PathVariable UUID id, @RequestBody UpdateTaskRequest request,Authentication authentication) {
        PersonalTaskResponse task = taskService.updatePersonalTask(id, request, authentication);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity<Void> deletePersonalTask(@PathVariable UUID id,Authentication authentication){
        taskService.deletePersonalTaskById(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAllTasks")
    public ResponseEntity<List<PersonalTaskResponse>> getMethodName(Authentication authentication) {
        List<PersonalTaskResponse> tasks =  taskService.getAllPersonalTasks(authentication);
        return ResponseEntity.ok(tasks);
    }
    


}
