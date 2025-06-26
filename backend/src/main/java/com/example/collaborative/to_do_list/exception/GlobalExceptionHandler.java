// package com.example.collaborative.to_do_list.exception;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

//     @ExceptionHandler(ConflictException.class)
//     public ResponseEntity<String> handleConflictException(ConflictException ex) {
//         return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
//     }

//     // You can add more handlers for other exceptions here
// }
