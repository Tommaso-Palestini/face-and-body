package com.itsprodigi.faceandbody.recensioni.service;

import com.itsprodigi.faceandbody.appuntamenti.model.Appuntamento;
import com.itsprodigi.faceandbody.appuntamenti.service.AppuntamentoService;
import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.recensioni.dto.RecensioneRequest;
import com.itsprodigi.faceandbody.recensioni.dto.RecensioneResponse;
import com.itsprodigi.faceandbody.recensioni.model.Recensione;
import com.itsprodigi.faceandbody.recensioni.repository.RecensioneRepository;
import com.itsprodigi.faceandbody.security.UtenteDetails;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecensioneService {

    private final RecensioneRepository recensioneRepository;
    private final AppuntamentoService appuntamentoService;

    public RecensioneService(RecensioneRepository recensioneRepository, AppuntamentoService appuntamentoService) {
        this.recensioneRepository = recensioneRepository;
        this.appuntamentoService = appuntamentoService;
    }

    @Transactional
    public RecensioneResponse crea(RecensioneRequest request, UtenteDetails utenteAutenticato) {
        Appuntamento appuntamento = appuntamentoService.trovaEntitaPerId(request.appuntamentoId());

        // Solo il proprietario dell'appuntamento può recensirlo
        if (!appuntamento.getUtente().getId().equals(utenteAutenticato.getId())) {
            throw new BusinessException(
                    "Puoi recensire solo i tuoi appuntamenti",
                    HttpStatus.FORBIDDEN
            );
        }

        // Solo appuntamenti completati possono essere recensiti
        if (appuntamento.getStato() != Appuntamento.Stato.COMPLETATO) {
            throw new BusinessException(
                    "Puoi recensire solo appuntamenti completati",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Un appuntamento può avere una sola recensione (garantito anche a livello DB da unique=true)
        if (recensioneRepository.existsByAppuntamentoId(request.appuntamentoId())) {
            throw new BusinessException(
                    "Hai già recensito questo appuntamento",
                    HttpStatus.CONFLICT
            );
        }

        Recensione recensione = Recensione.builder()
                .appuntamento(appuntamento)
                .utente(appuntamento.getUtente())
                .voto(request.voto())
                .commento(request.commento())
                .build();

        recensione = recensioneRepository.save(recensione);
        return toResponse(recensione);
    }

    @Transactional
    public void elimina(Long recensioneId, UtenteDetails utenteAutenticato) {
        Recensione recensione = trovaEntitaPerId(recensioneId);

        boolean isProprietario = recensione.getUtente().getId().equals(utenteAutenticato.getId());
        boolean isAdmin = utenteAutenticato.getUtente().getRuolo() == Utente.Ruolo.ADMIN;

        // Il cliente può eliminare solo le proprie, l'Admin modera eliminando qualsiasi recensione
        if (!isProprietario && !isAdmin) {
            throw new BusinessException(
                    "Non sei autorizzato ad eliminare questa recensione",
                    HttpStatus.FORBIDDEN
            );
        }

        recensioneRepository.delete(recensione);
    }

    public List<RecensioneResponse> trovaTutte() {
        return recensioneRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RecensioneResponse> trovaMie(UtenteDetails utenteAutenticato) {
        return recensioneRepository.findByUtenteId(utenteAutenticato.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private Recensione trovaEntitaPerId(Long id) {
        return recensioneRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Recensione non trovata", HttpStatus.NOT_FOUND));
    }

    private RecensioneResponse toResponse(Recensione recensione) {
        return new RecensioneResponse(
                recensione.getId(),
                recensione.getAppuntamento().getId(),
                recensione.getUtente().getNome() + " " + recensione.getUtente().getCognome(),
                recensione.getVoto(),
                recensione.getCommento(),
                recensione.getCreatoIl()
        );
    }
}