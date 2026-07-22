package com.itsprodigi.faceandbody.pacchetti.dto;

public record PacchettoServizioResponse(
        Long servizioId,
        String servizioNome,
        Integer quantitaInclusa
) {}