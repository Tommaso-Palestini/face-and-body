package com.itsprodigi.faceandbody.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Le nostre eccezioni di business (email duplicata, slot occupato, ownership, ecc.)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> gestisciBusinessException(BusinessException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", ex.getStatus().value());
        body.put("error", ex.getStatus().getReasonPhrase());
        body.put("message", ex.getMessage());

        return ResponseEntity.status(ex.getStatus()).body(body);
    }

    // Errori di validazione sui DTO (es. @NotBlank, @Email non rispettati)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> gestisciValidazione(MethodArgumentNotValidException ex) {
        Map<String, String> errori = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errori.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Errore di validazione");
        body.put("dettagli", errori);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // Rete di sicurezza: qualsiasi altra eccezione non gestita esplicitamente
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> gestisciGenerico(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Errore interno del server");
        body.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}