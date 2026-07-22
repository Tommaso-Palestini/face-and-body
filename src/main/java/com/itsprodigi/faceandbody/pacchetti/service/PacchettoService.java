package com.itsprodigi.faceandbody.pacchetti.service;

import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.pacchetti.dto.*;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PacchettoService {

    private final PacchettoRepository pacchettoRepository;
    private final AbbonamentoUtenteRepository abbonamentoRepository;
    private final ServizioService servizioService;
    private final UtenteRepository utenteRepository;

    public PacchettoService(
            PacchettoRepository pacchettoRepository,
            AbbonamentoUtenteRepository abbonamentoRepository,
            ServizioService servizioService,
            UtenteRepository utenteRepository
    ) {
        this.pacchettoRepository = pacchettoRepository;
        this.abbonamentoRepository = abbonamentoRepository;
        this.servizioService = servizioService;
        this.utenteRepository = utenteRepository;
    }

    // --- Gestione catalogo (Admin) ---

    @Transactional
    public PacchettoResponse crea(PacchettoRequest request) {
        Pacchetto pacchetto = Pacchetto.builder()
                .nome(request.nome())
                .descrizione(request.descrizione())
                .prezzo(request.prezzo())
                .disponibile(true)
                .build();

        // Prima salviamo il pacchetto per avere l'id, poi agganciamo i servizi collegati
        pacchetto = pacchettoRepository.save(pacchetto);

        for (PacchettoServizioRequest ps : request.servizi()) {
            Servizio servizio = servizioService.trovaEntitaPerId(ps.servizioId());
            PacchettoServizio pacchettoServizio = PacchettoServizio.builder()
                    .pacchetto(pacchetto)
                    .servizio(servizio)
                    .quantitaInclusa(ps.quantitaInclusa())
                    .build();
            pacchetto.getServizi().add(pacchettoServizio);
        }

        pacchetto = pacchettoRepository.save(pacchetto);
        return toResponse(pacchetto);
    }

    @Transactional
    public void disattiva(Long id) {
        Pacchetto pacchetto = trovaEntitaPerId(id);
        pacchetto.setDisponibile(false);
        pacchettoRepository.save(pacchetto);
    }

    public List<PacchettoResponse> trovaTuttiDisponibili() {
        return pacchettoRepository.findByDisponibileTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public PacchettoResponse trovaPerId(Long id) {
        return toResponse(trovaEntitaPerId(id));
    }

    // --- Acquisto e consumo (Cliente) ---

    @Transactional
    public AbbonamentoUtenteResponse acquista(Long pacchettoId, UtenteDetails utenteAutenticato) {
        Pacchetto pacchetto = trovaEntitaPerId(pacchettoId);

        if (!pacchetto.isDisponibile()) {
            throw new BusinessException("Pacchetto non disponibile", HttpStatus.BAD_REQUEST);
        }

        Utente utente = utenteRepository.findById(utenteAutenticato.getId())
                .orElseThrow(() -> new BusinessException("Utente non trovato", HttpStatus.NOT_FOUND));

        // Sessioni totali = somma delle quantità incluse in tutti i servizi del pacchetto
        int sessioniTotali = pacchetto.getServizi().stream()
                .mapToInt(PacchettoServizio::getQuantitaInclusa)
                .sum();

        AbbonamentoUtente abbonamento = AbbonamentoUtente.builder()
                .utente(utente)
                .pacchetto(pacchetto)
                .sessioniRimanenti(sessioniTotali)
                .stato(AbbonamentoUtente.Stato.ATTIVO)
                .build();

        abbonamento = abbonamentoRepository.save(abbonamento);
        return toAbbonamentoResponse(abbonamento);
    }

    @Transactional
    public void consumaSessione(Long abbonamentoId) {
        AbbonamentoUtente abbonamento = abbonamentoRepository.findById(abbonamentoId)
                .orElseThrow(() -> new BusinessException("Abbonamento non trovato", HttpStatus.NOT_FOUND));

        if (abbonamento.getStato() != AbbonamentoUtente.Stato.ATTIVO) {
            throw new BusinessException("Abbonamento non attivo", HttpStatus.BAD_REQUEST);
        }
        if (abbonamento.getSessioniRimanenti() <= 0) {
            throw new BusinessException("Nessuna sessione rimanente", HttpStatus.BAD_REQUEST);
        }

        abbonamento.setSessioniRimanenti(abbonamento.getSessioniRimanenti() - 1);

        // Se le sessioni finiscono, l'abbonamento passa automaticamente a ESAURITO
        if (abbonamento.getSessioniRimanenti() == 0) {
            abbonamento.setStato(AbbonamentoUtente.Stato.ESAURITO);
        }

        abbonamentoRepository.save(abbonamento);
    }

    public List<AbbonamentoUtenteResponse> trovaMieiAbbonamenti(UtenteDetails utenteAutenticato) {
        return abbonamentoRepository.findByUtenteId(utenteAutenticato.getId()).stream()
                .map(this::toAbbonamentoResponse)
                .toList();
    }

    private Pacchetto trovaEntitaPerId(Long id) {
        return pacchettoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Pacchetto non trovato", HttpStatus.NOT_FOUND));
    }

    private PacchettoResponse toResponse(Pacchetto pacchetto) {
        List<PacchettoServizioResponse> servizi = pacchetto.getServizi().stream()
                .map(ps -> new PacchettoServizioResponse(
                        ps.getServizio().getId(),
                        ps.getServizio().getNome(),
                        ps.getQuantitaInclusa()
                ))
                .toList();

        return new PacchettoResponse(
                pacchetto.getId(),
                pacchetto.getNome(),
                pacchetto.getDescrizione(),
                pacchetto.getPrezzo(),
                pacchetto.isDisponibile(),
                servizi
        );
    }

    private AbbonamentoUtenteResponse toAbbonamentoResponse(AbbonamentoUtente abbonamento) {
        return new AbbonamentoUtenteResponse(
                abbonamento.getId(),
                abbonamento.getPacchetto().getId(),
                abbonamento.getPacchetto().getNome(),
                abbonamento.getSessioniRimanenti(),
                abbonamento.getStato().name(),
                abbonamento.getAcquistatoIl()
        );
    }
}