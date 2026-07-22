package com.itsprodigi.faceandbody.pacchetti.model;

import com.itsprodigi.faceandbody.utenti.model.Utente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "abbonamenti_utenti")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbbonamentoUtente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ManyToOne: un utente può avere più abbonamenti
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    // ManyToOne: più utenti possono acquistare lo stesso pacchetto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pacchetto_id", nullable = false)
    private Pacchetto pacchetto;

    @Column(nullable = false)
    private Integer sessioniRimanenti; // scala di 1 ogni volta che prenota un servizio incluso

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Stato stato = Stato.ATTIVO;

    @Column(nullable = false, updatable = false)
    private LocalDateTime acquistatoIl;

    @PrePersist
    protected void onCreate() {
        this.acquistatoIl = LocalDateTime.now();
    }

    public enum Stato {
        ATTIVO,
        ESAURITO,
        CANCELLATO
    }
}