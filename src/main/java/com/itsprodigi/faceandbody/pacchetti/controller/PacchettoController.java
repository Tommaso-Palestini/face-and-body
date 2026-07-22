package com.itsprodigi.faceandbody.pacchetti.controller;

import com.itsprodigi.faceandbody.pacchetti.dto.AbbonamentoUtenteResponse;
import com.itsprodigi.faceandbody.pacchetti.dto.PacchettoRequest;
import com.itsprodigi.faceandbody.pacchetti.dto.PacchettoResponse;
import com.itsprodigi.faceandbody.pacchetti.service.PacchettoService;
import com.itsprodigi.faceandbody.security.UtenteDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacchetti")
public class PacchettoController {

    private final PacchettoService pacchettoService;

    public PacchettoController(PacchettoService pacchettoService) {
        this.pacchettoService = pacchettoService;
    }

    // Pubblico: catalogo pacchetti
    @GetMapping
    public ResponseEntity<List<PacchettoResponse>> trovaTuttiDisponibili() {
        return ResponseEntity.ok(pacchettoService.trovaTuttiDisponibili());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacchettoResponse> trovaPerId(@PathVariable Long id) {
        return ResponseEntity.ok(pacchettoService.trovaPerId(id));
    }

    // Solo Admin (vedi SecurityConfig)
    @PostMapping
    public ResponseEntity<PacchettoResponse> crea(@Valid @RequestBody PacchettoRequest request) {
        PacchettoResponse response = pacchettoService.crea(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> disattiva(@PathVariable Long id) {
        pacchettoService.disattiva(id);
        return ResponseEntity.noContent().build();
    }

    // Cliente: acquista un pacchetto
    @PostMapping("/{id}/acquista")
    public ResponseEntity<AbbonamentoUtenteResponse> acquista(
            @PathVariable Long id,
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        AbbonamentoUtenteResponse response = pacchettoService.acquista(id, utenteAutenticato);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Cliente: vede i propri abbonamenti attivi/esauriti
    @GetMapping("/miei-abbonamenti")
    public ResponseEntity<List<AbbonamentoUtenteResponse>> trovaMieiAbbonamenti(
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        return ResponseEntity.ok(pacchettoService.trovaMieiAbbonamenti(utenteAutenticato));
    }
}