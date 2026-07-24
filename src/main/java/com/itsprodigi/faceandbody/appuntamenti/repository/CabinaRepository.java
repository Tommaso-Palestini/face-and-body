package com.itsprodigi.faceandbody.appuntamenti.repository;

import com.itsprodigi.faceandbody.appuntamenti.model.Cabina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CabinaRepository extends JpaRepository<Cabina, Long> {
    List<Cabina> findByAttivaTrue();
}