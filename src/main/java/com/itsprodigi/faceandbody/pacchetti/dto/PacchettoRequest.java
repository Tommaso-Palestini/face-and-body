package com.itsprodigi.faceandbody.pacchetti.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.List;

public record PacchettoRequest(
        @NotBlank String nome,
        String descrizione,
        @Positive BigDecimal prezzo,
        @NotEmpty @Valid List<PacchettoServizioRequest> servizi
) {}