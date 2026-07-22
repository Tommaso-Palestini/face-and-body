package com.itsprodigi.faceandbody.recensioni.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RecensioneRequest(
        @NotNull Long appuntamentoId,
        @NotNull @Min(1) @Max(5) Integer voto,
        @NotBlank String commento
) {}