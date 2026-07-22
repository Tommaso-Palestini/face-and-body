package com.itsprodigi.faceandbody.utenti.service;

import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.security.jwt.JwtUtil;
import com.itsprodigi.faceandbody.utenti.dto.UtenteRegistrazioneRequest;
import com.itsprodigi.faceandbody.utenti.dto.UtenteResponse;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import com.itsprodigi.faceandbody.utenti.repository.UtenteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UtenteServiceTest {

    @Mock
    private UtenteRepository utenteRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UtenteService utenteService;

    private UtenteRegistrazioneRequest request;

    @BeforeEach
    void setUp() {
        request = new UtenteRegistrazioneRequest(
                "Mario", "Rossi", "mario.rossi@test.com", "password123"
        );
    }

    @Test
    void registra_conEmailNuova_creaUtenteConSuccesso() {
        when(utenteRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("hashedPassword");

        Utente utenteSalvato = Utente.builder()
                .id(1L)
                .nome("Mario")
                .cognome("Rossi")
                .email("mario.rossi@test.com")
                .password("hashedPassword")
                .ruolo(Utente.Ruolo.CLIENTE)
                .attivo(true)
                .dataRegistrazione(LocalDateTime.now())
                .build();

        when(utenteRepository.save(any(Utente.class))).thenReturn(utenteSalvato);

        UtenteResponse response = utenteService.registra(request);

        assertThat(response.email()).isEqualTo("mario.rossi@test.com");
        assertThat(response.ruolo()).isEqualTo("CLIENTE");
        assertThat(response.nome()).isEqualTo("Mario");
    }

    @Test
    void registra_conEmailGiaEsistente_lanciaBusinessException() {
        when(utenteRepository.existsByEmail(request.email())).thenReturn(true);

        assertThatThrownBy(() -> utenteService.registra(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Email già registrata");
    }
}