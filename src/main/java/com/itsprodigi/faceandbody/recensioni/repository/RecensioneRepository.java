package com.itsprodigi.faceandbody.recensioni.repository;

import com.itsprodigi.faceandbody.recensioni.model.Recensione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecensioneRepository extends JpaRepository<Recensione, Long> {
    List<Recensione> findByUtenteId(Long utenteId);
    Optional<Recensione> findByAppuntamentoId(Long appuntamentoId);
    boolean existsByAppuntamentoId(Long appuntamentoId);
}