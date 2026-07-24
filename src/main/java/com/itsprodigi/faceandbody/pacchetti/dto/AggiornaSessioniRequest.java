package com.itsprodigi.faceandbody.pacchetti.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record AggiornaSessioniRequest(
        @NotNull @PositiveOrZero Integer sessioniRimanenti
) {}