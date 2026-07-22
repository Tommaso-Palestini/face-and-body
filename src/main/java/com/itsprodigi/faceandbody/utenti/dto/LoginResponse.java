package com.itsprodigi.faceandbody.utenti.dto;

public record LoginResponse(
        String token,
        String email,
        String nome,
        String ruolo
) {}