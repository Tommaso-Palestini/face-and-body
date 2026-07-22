package com.itsprodigi.faceandbody.recensioni.dto;

import java.time.LocalDateTime;

public record RecensioneResponse(
        Long id,
        Long appuntamentoId,
        String utenteNomeCompleto,
        Integer voto,
        String commento,
        LocalDateTime creatoIl
) {}