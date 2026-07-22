package com.itsprodigi.faceandbody.servizi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ServizioRequest(
        @NotBlank String nome,
        String descrizione,
        @Positive BigDecimal prezzo,
        @Positive Integer durataMuniti
) {}