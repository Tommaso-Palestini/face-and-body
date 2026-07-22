package com.itsprodigi.faceandbody.servizi.dto;

import java.math.BigDecimal;

public record ServizioResponse(
        Long id,
        String nome,
        String descrizione,
        BigDecimal prezzo,
        Integer durataMuniti,
        boolean disponibile
) {}