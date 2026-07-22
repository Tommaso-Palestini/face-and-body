package com.itsprodigi.faceandbody.pacchetti.service;

import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.pacchetti.dto.AbbonamentoUtenteResponse;
import com.itsprodigi.faceandbody.pacchetti.model.AbbonamentoUtente;
import com.itsprodigi.faceandbody.pacchetti.model.Pacchetto;
import com.itsprodigi.faceandbody.pacchetti.model.PacchettoServizio;
import com.itsprodigi.faceandbody.pacchetti.repository.AbbonamentoUtenteRepository;
import com.itsprodigi.faceandbody.pacchetti.repository.PacchettoRepository;
import com.itsprodigi.faceandbody.security.UtenteDetails;
import com.itsprodigi.faceandbody.servizi.model.Servizio;
import com.itsprodigi.faceandbody.servizi.service.ServizioService;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import com.itsprodigi.faceandbody.utenti.repository.UtenteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PacchettoServiceTest {

    @Mock
    private PacchettoRepository pacchettoRepository;

    @Mock
    private AbbonamentoUtenteRepository abbonamentoRepository;

    @Mock
    private ServizioService servizioService;

    @Mock
    private UtenteRepository utenteRepository;

    @InjectMocks
    private PacchettoService pacchettoService;

    private Utente mario;
    private UtenteDetails marioDetails;
    private Pacchetto pacchetto;
    private AbbonamentoUtente abbonamento;

    @BeforeEach
    void setUp() {
        mario = Utente.builder()
                .id(1L).nome("Mario").cognome("Rossi")
                .email("mario@test.com").ruolo(Utente.Ruolo.CLIENTE)
                .build();
        marioDetails = new UtenteDetails(mario);

        Servizio servizio = Servizio.builder()
                .id(1L).nome("Massaggio").prezzo(new BigDecimal("40.00"))
                .durataMuniti(60).disponibile(true)
                .build();

        pacchetto = Pacchetto.builder()
                .id(1L).nome("Pacchetto 5 Massaggi")
                .prezzo(new BigDecimal("180.00")).disponibile(true)
                .build();

        PacchettoServizio ps = PacchettoServizio.builder()
                .pacchetto(pacchetto).servizio(servizio).quantitaInclusa(5)
                .build();
        pacchetto.getServizi().add(ps);

        abbonamento = AbbonamentoUtente.builder()
                .id(1L).utente(mario).pacchetto(pacchetto)
                .sessioniRimanenti(5).stato(AbbonamentoUtente.Stato.ATTIVO)
                .build();
    }

    @Test
    void acquista_pacchettoDisponibile_creaAbbonamentoConSessioniCorrette() {
        when(pacchettoRepository.findById(1L)).thenReturn(Optional.of(pacchetto));
        when(utenteRepository.findById(1L)).thenReturn(Optional.of(mario));
        when(abbonamentoRepository.save(any(AbbonamentoUtente.class))).thenReturn(abbonamento);

        AbbonamentoUtenteResponse response = pacchettoService.acquista(1L, marioDetails);

        assertThat(response.sessioniRimanenti()).isEqualTo(5);
        assertThat(response.stato()).isEqualTo("ATTIVO");
    }

    @Test
    void acquista_pacchettoNonDisponibile_lanciaBusinessException() {
        pacchetto.setDisponibile(false);
        when(pacchettoRepository.findById(1L)).thenReturn(Optional.of(pacchetto));

        assertThatThrownBy(() -> pacchettoService.acquista(1L, marioDetails))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("non disponibile");
    }

    @Test
    void consumaSessione_conSessioniDisponibili_decrementaContatore() {
        when(abbonamentoRepository.findById(1L)).thenReturn(Optional.of(abbonamento));
        when(abbonamentoRepository.save(any(AbbonamentoUtente.class))).thenReturn(abbonamento);

        pacchettoService.consumaSessione(1L);

        assertThat(abbonamento.getSessioniRimanenti()).isEqualTo(4);
        assertThat(abbonamento.getStato()).isEqualTo(AbbonamentoUtente.Stato.ATTIVO);
    }

    @Test
    void consumaSessione_ultimaSessioneDisponibile_passaAEsaurito() {
        abbonamento.setSessioniRimanenti(1);
        when(abbonamentoRepository.findById(1L)).thenReturn(Optional.of(abbonamento));
        when(abbonamentoRepository.save(any(AbbonamentoUtente.class))).thenReturn(abbonamento);

        pacchettoService.consumaSessione(1L);

        assertThat(abbonamento.getSessioniRimanenti()).isEqualTo(0);
        assertThat(abbonamento.getStato()).isEqualTo(AbbonamentoUtente.Stato.ESAURITO);
    }

    @Test
    void consumaSessione_senzaSessioniRimanenti_lanciaBusinessException() {
        abbonamento.setSessioniRimanenti(0);
        when(abbonamentoRepository.findById(1L)).thenReturn(Optional.of(abbonamento));

        assertThatThrownBy(() -> pacchettoService.consumaSessione(1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Nessuna sessione rimanente");
    }
}