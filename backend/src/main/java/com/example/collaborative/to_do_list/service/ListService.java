package com.example.collaborative.to_do_list.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.collaborative.to_do_list.adapter.UserAdapter;
import com.example.collaborative.to_do_list.dto.list.ReorderListDto;
import com.example.collaborative.to_do_list.dto.task.TaskDto.PersonalTaskResponse;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListId;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListRequest;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListResponse;
import com.example.collaborative.to_do_list.dto.list.ListDto.PersonalListResponseAndCount;
import com.example.collaborative.to_do_list.dto.list.ListDto.UpdateListRequest;
import com.example.collaborative.to_do_list.exception.ResourceNotFoundException;
import com.example.collaborative.to_do_list.exception.UserNotFoundException;
import com.example.collaborative.to_do_list.model.PersonalList;
import com.example.collaborative.to_do_list.model.PersonalTask;
import com.example.collaborative.to_do_list.model.User;
import com.example.collaborative.to_do_list.repo.PersonalListRepo;
import com.example.collaborative.to_do_list.repo.PersonalTaskRepo;
import com.example.collaborative.to_do_list.repo.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ListService {
    
    private final PersonalListRepo personalListRepo;
    private final UserRepo userRepo;

    @Transactional
    public PersonalListResponse createPersonalList(PersonalListRequest listRequest,Authentication authentication){

        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();
        User creator = userRepo.findById(userDetails.getId())
        .orElseThrow(() -> new UserNotFoundException(userDetails.getId()));

        int newPosition = personalListRepo.findMaxPosition(creator.getId()).orElse(0)+1;
        PersonalList list = PersonalList.builder()
        .name(listRequest.name())
        .color(listRequest.color())
        .position(newPosition)
        .createdBy(creator)
        .build();

        return PersonalListResponse.from(personalListRepo.save(list));
    }

    @Transactional
    public List<PersonalListResponseAndCount> getAllPersonalLists(Authentication authentication){
        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();
        List<PersonalList> lists =personalListRepo.findByCreatedByIdWithTasks(userDetails.getId());
        
        return lists.stream()
        .map(list -> PersonalListResponseAndCount.from(
            list, 
            list.getTasks().size())
        )
        .collect(Collectors.toList());
    }

    @Transactional
    public PersonalListResponse updatePersonalList(UUID id,UpdateListRequest updateListRequest,Authentication authentication){
        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();

        PersonalList list = personalListRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(id));

        if(!list.getCreatedBy().getId().equals(userDetails.getId())){
            throw new AccessDeniedException("You don't own this list.");
        }
        if (updateListRequest.name() != null) {
            list.setName(updateListRequest.name());
        }
        if (updateListRequest.color() != null) {
            list.setColor(updateListRequest.color());
        }

            list.setUpdatedAt(LocalDateTime.now());
    
            return PersonalListResponse.from(list);
    }

    @Transactional
    public void deletePersonalList(UUID id,Authentication authentication){
        UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();
        PersonalList list = personalListRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException(id));
        if(!list.getCreatedBy().getId().equals(userDetails.getId())){
            throw new AccessDeniedException("You don't own this list.");
        }

        personalListRepo.decrementPositionsGreaterThenPositionId(list.getCreatedBy().getId(), list.getPosition());
        
        personalListRepo.delete(list);
    }

    @Transactional
public void reorderPersonalList(List<ReorderListDto> dtos, Authentication authentication) {
    UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();

    for(ReorderListDto reorderList:dtos){
        PersonalList list = personalListRepo.findById(reorderList.getId())
        .orElseThrow(() -> new ResourceNotFoundException(reorderList.getId()));

        if (!list.getCreatedBy().getId().equals(userDetails.getId())) {
            throw new AccessDeniedException("You do not own this list.");
        }

        list.setPosition(reorderList.getPosition());
    }

}

@Transactional
public PersonalListResponse getPersonalList(UUID id,Authentication authentication){
    UserAdapter userDetails = (UserAdapter) authentication.getPrincipal();

    PersonalList list = personalListRepo.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(id));

    if (!list.getCreatedBy().getId().equals(userDetails.getId())) {
            throw new AccessDeniedException("You do not own this list.");
        }
        return PersonalListResponse.from(list);
}



}
