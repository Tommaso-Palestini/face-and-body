package com.itsprodigi.faceandbody.pacchetti.repository;

import com.itsprodigi.faceandbody.pacchetti.model.Pacchetto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PacchettoRepository extends JpaRepository<Pacchetto, Long> {
    List<Pacchetto> findByDisponibileTrue();
}