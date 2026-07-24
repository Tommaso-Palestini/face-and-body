package com.itsprodigi.faceandbody.pacchetti.dto;

import java.time.LocalDateTime;

public record AbbonamentoAdminResponse(
        Long id,
        String utenteNomeCompleto,
        Long pacchettoId,
        String pacchettoNome,
        Integer sessioniRimanenti,
        String stato,
        LocalDateTime acquistatoIl
) {}