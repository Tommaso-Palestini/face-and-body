package com.itsprodigi.faceandbody.appuntamenti.repository;

import com.itsprodigi.faceandbody.appuntamenti.model.Operatrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperatriceRepository extends JpaRepository<Operatrice, Long> {
    List<Operatrice> findByAttivaTrue();
}