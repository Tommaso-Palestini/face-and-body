package com.itsprodigi.faceandbody.pacchetti.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PacchettoServizioRequest(
        @NotNull Long servizioId,
        @Positive Integer quantitaInclusa
) {}