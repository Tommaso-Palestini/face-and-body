package com.itsprodigi.faceandbody.appuntamenti.controller;

import com.itsprodigi.faceandbody.appuntamenti.dto.AppuntamentoRequest;
import com.itsprodigi.faceandbody.appuntamenti.dto.AppuntamentoResponse;
import com.itsprodigi.faceandbody.appuntamenti.service.AppuntamentoService;
import com.itsprodigi.faceandbody.security.UtenteDetails;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appuntamenti")
public class AppuntamentoController {

    private final AppuntamentoService appuntamentoService;

    public AppuntamentoController(AppuntamentoService appuntamentoService) {
        this.appuntamentoService = appuntamentoService;
    }

    @PostMapping
    public ResponseEntity<AppuntamentoResponse> prenota(
            @Valid @RequestBody AppuntamentoRequest request,
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        AppuntamentoResponse response = appuntamentoService.prenota(request, utenteAutenticato);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/miei")
    public ResponseEntity<List<AppuntamentoResponse>> trovaMiei(
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        return ResponseEntity.ok(appuntamentoService.trovaMiei(utenteAutenticato));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppuntamentoResponse> trovaPerId(
            @PathVariable Long id,
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        return ResponseEntity.ok(appuntamentoService.trovaPerId(id, utenteAutenticato));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancella(
            @PathVariable Long id,
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        appuntamentoService.cancella(id, utenteAutenticato);
        return ResponseEntity.noContent().build();
    }

    // Endpoint per il calendario: chiunque sia autenticato può vedere gli slot occupati
    // di un servizio (senza sapere di chi sono), per disegnare la disponibilità
    @GetMapping("/disponibilita")
    public ResponseEntity<List<LocalDateTime>> trovaSlotOccupati(
            @RequestParam Long servizioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inizio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fine
    ) {
        return ResponseEntity.ok(appuntamentoService.trovaSlotOccupati(servizioId, inizio, fine));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/completa")
    public ResponseEntity<AppuntamentoResponse> completa(@PathVariable Long id) {
        return ResponseEntity.ok(appuntamentoService.completaAppuntamento(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/tutti")
    public ResponseEntity<List<AppuntamentoResponse>> trovaTutti() {
        return ResponseEntity.ok(appuntamentoService.trovaTutti());
    }
}