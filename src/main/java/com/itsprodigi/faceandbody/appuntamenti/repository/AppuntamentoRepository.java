package com.itsprodigi.faceandbody.appuntamenti.repository;

import com.itsprodigi.faceandbody.appuntamenti.model.Appuntamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppuntamentoRepository extends JpaRepository<Appuntamento, Long> {

    List<Appuntamento> findByUtenteId(Long utenteId);

    boolean existsByServizioIdAndDataOraAndStatoNot(
            Long servizioId,
            LocalDateTime dataOra,
            Appuntamento.Stato stato
    );

    // Query JPQL: restituisce solo gli orari occupati per un servizio in un periodo,
    // usata dal frontend per disegnare il calendario di disponibilità
    @Query("SELECT a.dataOra FROM Appuntamento a " +
            "WHERE a.servizio.id = :servizioId " +
            "AND a.dataOra BETWEEN :inizio AND :fine " +
            "AND a.stato <> 'CANCELLATO' " +
            "ORDER BY a.dataOra ASC")
    List<LocalDateTime> findSlotOccupatiNelPeriodo(
            @Param("servizioId") Long servizioId,
            @Param("inizio") LocalDateTime inizio,
            @Param("fine") LocalDateTime fine
    );
}