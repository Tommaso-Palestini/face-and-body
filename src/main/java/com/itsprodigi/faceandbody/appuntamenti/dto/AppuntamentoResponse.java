package com.itsprodigi.faceandbody.appuntamenti.dto;

import java.time.LocalDateTime;

public record AppuntamentoResponse(
        Long id,
        Long utenteId,
        String utenteNomeCompleto,
        Long servizioId,
        String servizioNome,
        LocalDateTime dataOra,
        String stato,
        LocalDateTime creatoIl
) {}