package com.itsprodigi.faceandbody.servizi.service;

import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.servizi.dto.ServizioRequest;
import com.itsprodigi.faceandbody.servizi.dto.ServizioResponse;
import com.itsprodigi.faceandbody.servizi.model.Servizio;
import com.itsprodigi.faceandbody.servizi.repository.ServizioRepository;
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
class ServizioServiceTest {

    @Mock
    private ServizioRepository servizioRepository;

    @InjectMocks
    private ServizioService servizioService;

    private ServizioRequest request;
    private Servizio servizioEsistente;

    @BeforeEach
    void setUp() {
        request = new ServizioRequest(
                "Manicure Classica", "Trattamento base", new BigDecimal("25.00"), 45
        );

        servizioEsistente = Servizio.builder()
                .id(1L)
                .nome("Manicure Classica")
                .descrizione("Trattamento base")
                .prezzo(new BigDecimal("25.00"))
                .durataMuniti(45)
                .disponibile(true)
                .build();
    }

    @Test
    void crea_conDatiValidi_restituisceServizioCreato() {
        when(servizioRepository.save(any(Servizio.class))).thenReturn(servizioEsistente);

        ServizioResponse response = servizioService.crea(request);

        assertThat(response.nome()).isEqualTo("Manicure Classica");
        assertThat(response.prezzo()).isEqualByComparingTo("25.00");
        assertThat(response.disponibile()).isTrue();
    }

    @Test
    void trovaPerId_conIdEsistente_restituisceServizio() {
        when(servizioRepository.findById(1L)).thenReturn(Optional.of(servizioEsistente));

        ServizioResponse response = servizioService.trovaPerId(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Manicure Classica");
    }

    @Test
    void trovaPerId_conIdInesistente_lanciaBusinessException() {
        when(servizioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> servizioService.trovaPerId(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Servizio non trovato");
    }

    @Test
    void disattiva_impostaDisponibileFalse() {
        when(servizioRepository.findById(1L)).thenReturn(Optional.of(servizioEsistente));
        when(servizioRepository.save(any(Servizio.class))).thenReturn(servizioEsistente);

        servizioService.disattiva(1L);

        assertThat(servizioEsistente.isDisponibile()).isFalse();
    }
}