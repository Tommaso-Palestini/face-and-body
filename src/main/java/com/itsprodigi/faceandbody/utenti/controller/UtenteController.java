package com.itsprodigi.faceandbody.utenti.controller;

import com.itsprodigi.faceandbody.utenti.dto.UtenteResponse;
import com.itsprodigi.faceandbody.utenti.service.UtenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utenti")
public class UtenteController {

    private final UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }

    // Protetto da SecurityConfig: .requestMatchers("/api/utenti/**").hasRole("ADMIN")

    @GetMapping
    public ResponseEntity<List<UtenteResponse>> trovaTutti() {
        return ResponseEntity.ok(utenteService.trovaTutti());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtenteResponse> trovaPerId(@PathVariable Long id) {
        return ResponseEntity.ok(utenteService.trovaPerId(id));
    }
}