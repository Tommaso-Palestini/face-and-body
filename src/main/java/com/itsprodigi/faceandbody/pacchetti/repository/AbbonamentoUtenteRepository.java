package com.itsprodigi.faceandbody.pacchetti.repository;

import com.itsprodigi.faceandbody.pacchetti.model.AbbonamentoUtente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AbbonamentoUtenteRepository extends JpaRepository<AbbonamentoUtente, Long> {
    List<AbbonamentoUtente> findByUtenteId(Long utenteId);
    List<AbbonamentoUtente> findByUtenteIdAndStato(Long utenteId, AbbonamentoUtente.Stato stato);
}