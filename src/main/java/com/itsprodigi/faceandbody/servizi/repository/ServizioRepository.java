package com.itsprodigi.faceandbody.servizi.repository;

import com.itsprodigi.faceandbody.servizi.model.Servizio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServizioRepository extends JpaRepository<Servizio, Long> {
    List<Servizio> findByDisponibileTrue();
}