package com.example.collaborative.to_do_list.exception;

import java.util.UUID;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(UUID listId) {
        super("List not found with ID:" + listId);
    }
}
