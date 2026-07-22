package com.itsprodigi.faceandbody.servizi.service;

import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.servizi.dto.ServizioRequest;
import com.itsprodigi.faceandbody.servizi.dto.ServizioResponse;
import com.itsprodigi.faceandbody.servizi.model.Servizio;
import com.itsprodigi.faceandbody.servizi.repository.ServizioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServizioService {

    private final ServizioRepository servizioRepository;

    public ServizioService(ServizioRepository servizioRepository) {
        this.servizioRepository = servizioRepository;
    }

    @Transactional
    public ServizioResponse crea(ServizioRequest request) {
        Servizio servizio = Servizio.builder()
                .nome(request.nome())
                .descrizione(request.descrizione())
                .prezzo(request.prezzo())
                .durataMuniti(request.durataMuniti())
                .disponibile(true)
                .build();

        servizio = servizioRepository.save(servizio);
        return toResponse(servizio);
    }

    @Transactional
    public ServizioResponse aggiorna(Long id, ServizioRequest request) {
        Servizio servizio = trovaEntitaPerId(id);

        servizio.setNome(request.nome());
        servizio.setDescrizione(request.descrizione());
        servizio.setPrezzo(request.prezzo());
        servizio.setDurataMuniti(request.durataMuniti());

        servizio = servizioRepository.save(servizio);
        return toResponse(servizio);
    }

    @Transactional
    public void disattiva(Long id) {
        Servizio servizio = trovaEntitaPerId(id);
        servizio.setDisponibile(false); // soft delete: non eliminiamo mai, disattiviamo
        servizioRepository.save(servizio);
    }

    public ServizioResponse trovaPerId(Long id) {
        return toResponse(trovaEntitaPerId(id));
    }

    public List<ServizioResponse> trovaTuttiDisponibili() {
        return servizioRepository.findByDisponibileTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ServizioResponse> trovaTutti() {
        return servizioRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    // Metodo pacchetto-package: usato anche da altri Service (es. AppuntamentoService) che devono
    // recuperare l'entità Servizio vera e propria, non solo il DTO
    public Servizio trovaEntitaPerId(Long id) {
        return servizioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Servizio non trovato", HttpStatus.NOT_FOUND));
    }

    private ServizioResponse toResponse(Servizio servizio) {
        return new ServizioResponse(
                servizio.getId(),
                servizio.getNome(),
                servizio.getDescrizione(),
                servizio.getPrezzo(),
                servizio.getDurataMuniti(),
                servizio.isDisponibile()
        );
    }
}