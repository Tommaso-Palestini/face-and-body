package com.itsprodigi.faceandbody.pacchetti.dto;

import java.math.BigDecimal;
import java.util.List;

public record PacchettoResponse(
        Long id,
        String nome,
        String descrizione,
        BigDecimal prezzo,
        boolean disponibile,
        List<PacchettoServizioResponse> servizi
) {}