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

    @Transactional
    public PacchettoResponse aggiorna(Long id, PacchettoRequest request) {
        Pacchetto pacchetto = trovaEntitaPerId(id);

        pacchetto.setNome(request.nome());
        pacchetto.setDescrizione(request.descrizione());
        pacchetto.setPrezzo(request.prezzo());

        pacchetto.getServizi().clear();
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
    public PacchettoResponse crea(PacchettoRequest request) {
        Pacchetto pacchetto = Pacchetto.builder()
                .nome(request.nome())
                .descrizione(request.descrizione())
                .prezzo(request.prezzo())
                .disponibile(true)
                .build();

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

    @Transactional
    public AbbonamentoUtenteResponse acquista(Long pacchettoId, UtenteDetails utenteAutenticato) {
        Pacchetto pacchetto = trovaEntitaPerId(pacchettoId);

        if (!pacchetto.isDisponibile()) {
            throw new BusinessException("Pacchetto non disponibile", HttpStatus.BAD_REQUEST);
        }

        Utente utente = utenteRepository.findById(utenteAutenticato.getId())
                .orElseThrow(() -> new BusinessException("Utente non trovato", HttpStatus.NOT_FOUND));

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

    // --- Gestione Admin ---

    public List<AbbonamentoAdminResponse> trovaTuttiAbbonamenti() {
        return abbonamentoRepository.findAll().stream()
                .map(a -> new AbbonamentoAdminResponse(
                        a.getId(),
                        a.getUtente().getNome() + " " + a.getUtente().getCognome(),
                        a.getPacchetto().getId(),
                        a.getPacchetto().getNome(),
                        a.getSessioniRimanenti(),
                        a.getStato().name(),
                        a.getAcquistatoIl()
                ))
                .toList();
    }

    @Transactional
    public AbbonamentoAdminResponse aggiornaSessioniAdmin(Long abbonamentoId, Integer nuoveSessioni) {
        AbbonamentoUtente abbonamento = abbonamentoRepository.findById(abbonamentoId)
                .orElseThrow(() -> new BusinessException("Abbonamento non trovato", HttpStatus.NOT_FOUND));

        abbonamento.setSessioniRimanenti(nuoveSessioni);
        if (nuoveSessioni == 0 && abbonamento.getStato() == AbbonamentoUtente.Stato.ATTIVO) {
            abbonamento.setStato(AbbonamentoUtente.Stato.ESAURITO);
        } else if (nuoveSessioni > 0 && abbonamento.getStato() == AbbonamentoUtente.Stato.ESAURITO) {
            abbonamento.setStato(AbbonamentoUtente.Stato.ATTIVO);
        }

        abbonamento = abbonamentoRepository.save(abbonamento);
        return new AbbonamentoAdminResponse(
                abbonamento.getId(),
                abbonamento.getUtente().getNome() + " " + abbonamento.getUtente().getCognome(),
                abbonamento.getPacchetto().getId(),
                abbonamento.getPacchetto().getNome(),
                abbonamento.getSessioniRimanenti(),
                abbonamento.getStato().name(),
                abbonamento.getAcquistatoIl()
        );
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