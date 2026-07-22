package com.itsprodigi.faceandbody.utenti.controller;

import com.itsprodigi.faceandbody.utenti.dto.*;
import com.itsprodigi.faceandbody.utenti.service.UtenteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtenteService utenteService;

    public AuthController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }

    @PostMapping("/registrazione")
    public ResponseEntity<UtenteResponse> registra(@Valid @RequestBody UtenteRegistrazioneRequest request) {
        UtenteResponse response = utenteService.registra(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = utenteService.login(request);
        return ResponseEntity.ok(response);
    }
}