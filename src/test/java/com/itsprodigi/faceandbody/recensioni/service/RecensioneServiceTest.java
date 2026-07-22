package com.itsprodigi.faceandbody.recensioni.service;

import com.itsprodigi.faceandbody.appuntamenti.model.Appuntamento;
import com.itsprodigi.faceandbody.appuntamenti.service.AppuntamentoService;
import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.recensioni.dto.RecensioneRequest;
import com.itsprodigi.faceandbody.recensioni.dto.RecensioneResponse;
import com.itsprodigi.faceandbody.recensioni.model.Recensione;
import com.itsprodigi.faceandbody.recensioni.repository.RecensioneRepository;
import com.itsprodigi.faceandbody.security.UtenteDetails;
import com.itsprodigi.faceandbody.servizi.model.Servizio;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecensioneServiceTest {

    @Mock
    private RecensioneRepository recensioneRepository;

    @Mock
    private AppuntamentoService appuntamentoService;

    @InjectMocks
    private RecensioneService recensioneService;

    private Utente mario;
    private Utente giulia;
    private Appuntamento appuntamentoCompletato;
    private UtenteDetails marioDetails;
    private RecensioneRequest request;

    @BeforeEach
    void setUp() {
        mario = Utente.builder()
                .id(1L).nome("Mario").cognome("Rossi")
                .email("mario@test.com").ruolo(Utente.Ruolo.CLIENTE)
                .build();

        giulia = Utente.builder()
                .id(2L).nome("Giulia").cognome("Bianchi")
                .email("giulia@test.com").ruolo(Utente.Ruolo.CLIENTE)
                .build();

        Servizio servizio = Servizio.builder()
                .id(1L).nome("Manicure").prezzo(new BigDecimal("25.00"))
                .durataMuniti(45).disponibile(true)
                .build();

        appuntamentoCompletato = Appuntamento.builder()
                .id(1L).utente(mario).servizio(servizio)
                .dataOra(LocalDateTime.now().minusDays(1))
                .stato(Appuntamento.Stato.COMPLETATO)
                .build();

        marioDetails = new UtenteDetails(mario);
        request = new RecensioneRequest(1L, 5, "Ottimo servizio!");
    }

    @Test
    void crea_suAppuntamentoCompletatoProprio_creaRecensione() {
        when(appuntamentoService.trovaEntitaPerId(1L)).thenReturn(appuntamentoCompletato);
        when(recensioneRepository.existsByAppuntamentoId(1L)).thenReturn(false);

        Recensione recensioneSalvata = Recensione.builder()
                .id(1L).appuntamento(appuntamentoCompletato).utente(mario)
                .voto(5).commento("Ottimo servizio!")
                .creatoIl(LocalDateTime.now())
                .build();

        when(recensioneRepository.save(any(Recensione.class))).thenReturn(recensioneSalvata);

        RecensioneResponse response = recensioneService.crea(request, marioDetails);

        assertThat(response.voto()).isEqualTo(5);
        assertThat(response.commento()).isEqualTo("Ottimo servizio!");
    }

    @Test
    void crea_suAppuntamentoDiAltroUtente_lanciaForbidden() {
        UtenteDetails giuliaDetails = new UtenteDetails(giulia);
        when(appuntamentoService.trovaEntitaPerId(1L)).thenReturn(appuntamentoCompletato);

        assertThatThrownBy(() -> recensioneService.crea(request, giuliaDetails))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Puoi recensire solo i tuoi appuntamenti");
    }

    @Test
    void crea_suAppuntamentoNonCompletato_lanciaBusinessException() {
        appuntamentoCompletato.setStato(Appuntamento.Stato.CONFERMATO);
        when(appuntamentoService.trovaEntitaPerId(1L)).thenReturn(appuntamentoCompletato);

        assertThatThrownBy(() -> recensioneService.crea(request, marioDetails))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("appuntamenti completati");
    }

    @Test
    void crea_giaRecensito_lanciaConflict() {
        when(appuntamentoService.trovaEntitaPerId(1L)).thenReturn(appuntamentoCompletato);
        when(recensioneRepository.existsByAppuntamentoId(1L)).thenReturn(true);

        assertThatThrownBy(() -> recensioneService.crea(request, marioDetails))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Hai già recensito");
    }
}