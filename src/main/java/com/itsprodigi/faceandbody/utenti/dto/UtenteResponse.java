package com.itsprodigi.faceandbody.utenti.dto;

import java.time.LocalDateTime;

public record UtenteResponse(
        Long id,
        String nome,
        String cognome,
        String email,
        String ruolo,
        boolean attivo,
        LocalDateTime dataRegistrazione
) {}