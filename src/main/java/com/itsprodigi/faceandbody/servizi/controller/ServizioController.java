package com.itsprodigi.faceandbody.servizi.controller;

import com.itsprodigi.faceandbody.servizi.dto.ServizioRequest;
import com.itsprodigi.faceandbody.servizi.dto.ServizioResponse;
import com.itsprodigi.faceandbody.servizi.service.ServizioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servizi")
public class ServizioController {

    private final ServizioService servizioService;

    public ServizioController(ServizioService servizioService) {
        this.servizioService = servizioService;
    }

    // Pubblico (vedi SecurityConfig): chiunque può vedere il catalogo
    @GetMapping
    public ResponseEntity<List<ServizioResponse>> trovaTuttiDisponibili() {
        return ResponseEntity.ok(servizioService.trovaTuttiDisponibili());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServizioResponse> trovaPerId(@PathVariable Long id) {
        return ResponseEntity.ok(servizioService.trovaPerId(id));
    }

    // Solo Admin (vedi SecurityConfig)
    @PostMapping
    public ResponseEntity<ServizioResponse> crea(@Valid @RequestBody ServizioRequest request) {
        ServizioResponse response = servizioService.crea(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServizioResponse> aggiorna(@PathVariable Long id, @Valid @RequestBody ServizioRequest request) {
        return ResponseEntity.ok(servizioService.aggiorna(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> disattiva(@PathVariable Long id) {
        servizioService.disattiva(id);
        return ResponseEntity.noContent().build();
    }

    // Solo Admin: catalogo completo incluso non disponibili
    @GetMapping("/admin/tutti")
    public ResponseEntity<List<ServizioResponse>> trovaTutti() {
        return ResponseEntity.ok(servizioService.trovaTutti());
    }
}