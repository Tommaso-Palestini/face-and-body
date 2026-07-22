package com.itsprodigi.faceandbody.appuntamenti.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AppuntamentoRequest(
        @NotNull Long servizioId,
        @NotNull @Future(message = "La data dell'appuntamento deve essere futura") LocalDateTime dataOra
) {}