package com.itsprodigi.faceandbody.appuntamenti.service;

import com.itsprodigi.faceandbody.appuntamenti.dto.AppuntamentoRequest;
import com.itsprodigi.faceandbody.appuntamenti.dto.AppuntamentoResponse;
import com.itsprodigi.faceandbody.appuntamenti.model.Appuntamento;
import com.itsprodigi.faceandbody.appuntamenti.repository.AppuntamentoRepository;
import com.itsprodigi.faceandbody.common.exception.BusinessException;
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
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppuntamentoServiceTest {

    @Mock
    private AppuntamentoRepository appuntamentoRepository;

    @Mock
    private ServizioService servizioService;

    @Mock
    private UtenteRepository utenteRepository;

    @InjectMocks
    private AppuntamentoService appuntamentoService;

    private Utente mario;
    private Utente giulia;
    private Servizio servizio;
    private Appuntamento appuntamentoDiMario;
    private UtenteDetails marioDetails;
    private UtenteDetails giuliaDetails;

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

        servizio = Servizio.builder()
                .id(1L).nome("Manicure").prezzo(new BigDecimal("25.00"))
                .durataMuniti(45).disponibile(true)
                .build();

        appuntamentoDiMario = Appuntamento.builder()
                .id(1L).utente(mario).servizio(servizio)
                .dataOra(LocalDateTime.now().plusDays(1))
                .stato(Appuntamento.Stato.CONFERMATO)
                .creatoIl(LocalDateTime.now())
                .build();

        marioDetails = new UtenteDetails(mario);
        giuliaDetails = new UtenteDetails(giulia);
    }

    @Test
    void prenota_conSlotLibero_creaAppuntamento() {
        AppuntamentoRequest request = new AppuntamentoRequest(1L, LocalDateTime.now().plusDays(1));

        when(servizioService.trovaEntitaPerId(1L)).thenReturn(servizio);
        when(appuntamentoRepository.existsByServizioIdAndDataOraAndStatoNot(
                any(), any(), any())).thenReturn(false);
        when(utenteRepository.findById(1L)).thenReturn(Optional.of(mario));
        when(appuntamentoRepository.save(any(Appuntamento.class))).thenReturn(appuntamentoDiMario);

        AppuntamentoResponse response = appuntamentoService.prenota(request, marioDetails);

        assertThat(response.utenteId()).isEqualTo(1L);
        assertThat(response.stato()).isEqualTo("CONFERMATO");
    }

    @Test
    void prenota_conSlotOccupato_lanciaBusinessException() {
        AppuntamentoRequest request = new AppuntamentoRequest(1L, LocalDateTime.now().plusDays(1));

        when(servizioService.trovaEntitaPerId(1L)).thenReturn(servizio);
        when(appuntamentoRepository.existsByServizioIdAndDataOraAndStatoNot(
                any(), any(), any())).thenReturn(true);

        assertThatThrownBy(() -> appuntamentoService.prenota(request, marioDetails))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Slot non disponibile");
    }

    @Test
    void cancella_comeProprietario_hasSuccesso() {
        when(appuntamentoRepository.findById(1L)).thenReturn(Optional.of(appuntamentoDiMario));

        appuntamentoService.cancella(1L, marioDetails);

        assertThat(appuntamentoDiMario.getStato()).isEqualTo(Appuntamento.Stato.CANCELLATO);
    }

    @Test
    void cancella_comeAltroUtente_lanciaForbidden() {
        // Il test più importante: Giulia NON può cancellare l'appuntamento di Mario
        when(appuntamentoRepository.findById(1L)).thenReturn(Optional.of(appuntamentoDiMario));

        assertThatThrownBy(() -> appuntamentoService.cancella(1L, giuliaDetails))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Non sei autorizzato");
    }
}