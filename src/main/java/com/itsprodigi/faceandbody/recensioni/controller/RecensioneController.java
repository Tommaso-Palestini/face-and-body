package com.itsprodigi.faceandbody.recensioni.controller;

import com.itsprodigi.faceandbody.recensioni.dto.RecensioneRequest;
import com.itsprodigi.faceandbody.recensioni.dto.RecensioneResponse;
import com.itsprodigi.faceandbody.recensioni.service.RecensioneService;
import com.itsprodigi.faceandbody.security.UtenteDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recensioni")
public class RecensioneController {

    private final RecensioneService recensioneService;

    public RecensioneController(RecensioneService recensioneService) {
        this.recensioneService = recensioneService;
    }

    @PostMapping
    public ResponseEntity<RecensioneResponse> crea(
            @Valid @RequestBody RecensioneRequest request,
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        RecensioneResponse response = recensioneService.crea(request, utenteAutenticato);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<RecensioneResponse>> trovaTutte() {
        return ResponseEntity.ok(recensioneService.trovaTutte());
    }

    @GetMapping("/mie")
    public ResponseEntity<List<RecensioneResponse>> trovaMie(
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        return ResponseEntity.ok(recensioneService.trovaMie(utenteAutenticato));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> elimina(
            @PathVariable Long id,
            @AuthenticationPrincipal UtenteDetails utenteAutenticato
    ) {
        recensioneService.elimina(id, utenteAutenticato);
        return ResponseEntity.noContent().build();
    }
}