package com.itsprodigi.faceandbody.appuntamenti.service;

import com.itsprodigi.faceandbody.appuntamenti.dto.AppuntamentoRequest;
import com.itsprodigi.faceandbody.appuntamenti.dto.AppuntamentoResponse;
import com.itsprodigi.faceandbody.appuntamenti.model.Appuntamento;
import com.itsprodigi.faceandbody.appuntamenti.model.Cabina;
import com.itsprodigi.faceandbody.appuntamenti.model.Operatrice;
import com.itsprodigi.faceandbody.appuntamenti.repository.AppuntamentoRepository;
import com.itsprodigi.faceandbody.appuntamenti.repository.CabinaRepository;
import com.itsprodigi.faceandbody.appuntamenti.repository.OperatriceRepository;
import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.security.UtenteDetails;
import com.itsprodigi.faceandbody.servizi.model.Servizio;
import com.itsprodigi.faceandbody.servizi.service.ServizioService;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import com.itsprodigi.faceandbody.utenti.repository.UtenteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.itsprodigi.faceandbody.appuntamenti.dto.OperatriceResponse;
import com.itsprodigi.faceandbody.appuntamenti.dto.CabinaResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppuntamentoService {

    private final AppuntamentoRepository appuntamentoRepository;
    private final ServizioService servizioService;
    private final UtenteRepository utenteRepository;
    private final OperatriceRepository operatriceRepository;
    private final CabinaRepository cabinaRepository;

    public AppuntamentoService(
            AppuntamentoRepository appuntamentoRepository,
            ServizioService servizioService,
            UtenteRepository utenteRepository,
            OperatriceRepository operatriceRepository,
            CabinaRepository cabinaRepository
    ) {
        this.appuntamentoRepository = appuntamentoRepository;
        this.servizioService = servizioService;
        this.utenteRepository = utenteRepository;
        this.operatriceRepository = operatriceRepository;
        this.cabinaRepository = cabinaRepository;
    }

    @Transactional
    public AppuntamentoResponse prenota(AppuntamentoRequest request, UtenteDetails utenteAutenticato) {
        Servizio servizio = servizioService.trovaEntitaPerId(request.servizioId());

        if (!servizio.isDisponibile()) {
            throw new BusinessException("Il servizio richiesto non è disponibile", HttpStatus.BAD_REQUEST);
        }

        boolean slotOccupato = appuntamentoRepository.existsByServizioIdAndDataOraAndStatoNot(
                request.servizioId(), request.dataOra(), Appuntamento.Stato.CANCELLATO
        );
        if (slotOccupato) {
            throw new BusinessException("Slot non disponibile per la data/ora scelta", HttpStatus.CONFLICT);
        }

        Utente utente = utenteRepository.findById(utenteAutenticato.getId())
                .orElseThrow(() -> new BusinessException("Utente non trovato", HttpStatus.NOT_FOUND));

        Operatrice operatrice = null;
        if (request.operatriceId() != null) {
            operatrice = operatriceRepository.findById(request.operatriceId())
                    .orElseThrow(() -> new BusinessException("Operatrice non trovata", HttpStatus.NOT_FOUND));
        }

        Cabina cabina = null;
        if (request.cabinaId() != null) {
            cabina = cabinaRepository.findById(request.cabinaId())
                    .orElseThrow(() -> new BusinessException("Cabina non trovata", HttpStatus.NOT_FOUND));
        }

        Appuntamento appuntamento = Appuntamento.builder()
                .utente(utente)
                .servizio(servizio)
                .dataOra(request.dataOra())
                .stato(Appuntamento.Stato.CONFERMATO)
                .operatrice(operatrice)
                .cabina(cabina)
                .build();

        appuntamento = appuntamentoRepository.save(appuntamento);
        return toResponse(appuntamento);
    }

    @Transactional
    public void cancella(Long appuntamentoId, UtenteDetails utenteAutenticato) {
        Appuntamento appuntamento = trovaEntitaPerId(appuntamentoId);
        verificaOwnershipOAdmin(appuntamento, utenteAutenticato);
        appuntamento.setStato(Appuntamento.Stato.CANCELLATO);
        appuntamentoRepository.save(appuntamento);
    }

    @Transactional
    public AppuntamentoResponse completaAppuntamento(Long appuntamentoId) {
        Appuntamento appuntamento = trovaEntitaPerId(appuntamentoId);
        appuntamento.setStato(Appuntamento.Stato.COMPLETATO);
        appuntamento = appuntamentoRepository.save(appuntamento);
        return toResponse(appuntamento);
    }

    public AppuntamentoResponse trovaPerId(Long id, UtenteDetails utenteAutenticato) {
        Appuntamento appuntamento = trovaEntitaPerId(id);
        verificaOwnershipOAdmin(appuntamento, utenteAutenticato);
        return toResponse(appuntamento);
    }

    public List<AppuntamentoResponse> trovaMiei(UtenteDetails utenteAutenticato) {
        return appuntamentoRepository.findByUtenteId(utenteAutenticato.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AppuntamentoResponse> trovaTutti() {
        return appuntamentoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<LocalDateTime> trovaSlotOccupati(Long servizioId, LocalDateTime inizio, LocalDateTime fine) {
        return appuntamentoRepository.findSlotOccupatiNelPeriodo(servizioId, inizio, fine);
    }

    public List<OperatriceResponse> trovaOperatriciAttive() {
        return operatriceRepository.findByAttivaTrue().stream()
                .map(o -> new OperatriceResponse(o.getId(), o.getNome()))
                .toList();
    }

    public List<CabinaResponse> trovaCabineAttive() {
        return cabinaRepository.findByAttivaTrue().stream()
                .map(c -> new CabinaResponse(c.getId(), c.getNome(), c.getTipo()))
                .toList();
    }

    public Appuntamento trovaEntitaPerId(Long id) {
        return appuntamentoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Appuntamento non trovato", HttpStatus.NOT_FOUND));
    }

    private void verificaOwnershipOAdmin(Appuntamento appuntamento, UtenteDetails utenteAutenticato) {
        boolean isProprietario = appuntamento.getUtente().getId().equals(utenteAutenticato.getId());
        boolean isAdmin = utenteAutenticato.getUtente().getRuolo() == Utente.Ruolo.ADMIN;

        if (!isProprietario && !isAdmin) {
            throw new BusinessException(
                    "Non sei autorizzato ad accedere a questo appuntamento",
                    HttpStatus.FORBIDDEN
            );
        }
    }

    private AppuntamentoResponse toResponse(Appuntamento appuntamento) {
        return new AppuntamentoResponse(
                appuntamento.getId(),
                appuntamento.getUtente().getId(),
                appuntamento.getUtente().getNome() + " " + appuntamento.getUtente().getCognome(),
                appuntamento.getServizio().getId(),
                appuntamento.getServizio().getNome(),
                appuntamento.getDataOra(),
                appuntamento.getStato().name(),
                appuntamento.getCreatoIl(),
                appuntamento.getOperatrice() != null ? appuntamento.getOperatrice().getNome() : null,
                appuntamento.getCabina() != null ? appuntamento.getCabina().getNome() : null
        );
    }
}