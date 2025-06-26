package com.example.collaborative.to_do_list.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.collaborative.to_do_list.dto.list.ReorderListDto;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListId;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListRequest;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListResponse;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListResponseAndCount;
import com.example.collaborative.to_do_list.dto.list.ListDto.UpdateListRequest;
import com.example.collaborative.to_do_list.model.PersonalList;
import com.example.collaborative.to_do_list.service.ListService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/list")
@AllArgsConstructor
public class ListController {
    
    private final ListService listService;

    @PostMapping("/createPersonalList")
    @ResponseStatus(HttpStatus.CREATED)
    public PersonalListResponse createPersonalList(@Valid @RequestBody PersonalListRequest listRequest,Authentication authentication){
       return listService.createPersonalList(listRequest,authentication);
    }

    @GetMapping("/getPersonalLists")
    public ResponseEntity<List<PersonalListResponseAndCount>> getPersonalLists(Authentication authentication) {
      List<PersonalListResponseAndCount> listResponse=  listService.getAllPersonalLists(authentication);
      return ResponseEntity.ok(listResponse);
    }
    
    @PutMapping("/editPersonalList/{id}")
    public ResponseEntity<PersonalListResponse> editPersonalList(@PathVariable UUID id,@Valid @RequestBody UpdateListRequest updateListRequest,Authentication authentication) {
        PersonalListResponse listResponse= listService.updatePersonalList(id, updateListRequest, authentication);
       return ResponseEntity.ok(listResponse);
    }

    @DeleteMapping("/deletePersonalList/{id}")
    public ResponseEntity<Void> deletePersonalList(@PathVariable UUID id,Authentication authentication){
        listService.deletePersonalList(id, authentication);
       return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorderList")
    public ResponseEntity<Void> reorderList(@RequestBody List<ReorderListDto> reorderList,Authentication authentication){
       listService.reorderPersonalList(reorderList,authentication);
       return ResponseEntity.ok().build();
    }

    @GetMapping("/getPersonalList/{id}")
    public ResponseEntity<PersonalListResponse> getPersonalList(@PathVariable UUID id,Authentication authentication) {
      PersonalListResponse list = listService.getPersonalList(id, authentication);
      return ResponseEntity.ok(list);
    }
    
}
