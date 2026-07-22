package com.itsprodigi.faceandbody.pacchetti.dto;

import java.time.LocalDateTime;

public record AbbonamentoUtenteResponse(
        Long id,
        Long pacchettoId,
        String pacchettoNome,
        Integer sessioniRimanenti,
        String stato,
        LocalDateTime acquistatoIl
) {}