package com.itsprodigi.faceandbody.utenti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UtenteRegistrazioneRequest(
        @NotBlank String nome,
        @NotBlank String cognome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "La password deve contenere almeno 8 caratteri") String password
) {}