package com.itsprodigi.faceandbody.appuntamenti.model;

import com.itsprodigi.faceandbody.servizi.model.Servizio;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appuntamenti")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appuntamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ManyToOne: molti appuntamenti possono appartenere a un utente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    // ManyToOne: molti appuntamenti possono riferirsi allo stesso servizio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servizio_id", nullable = false)
    private Servizio servizio;

    @Column(nullable = false)
    private LocalDateTime dataOra; // data e ora dell'appuntamento

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Stato stato = Stato.CONFERMATO;

    @Column(nullable = false, updatable = false)
    private LocalDateTime creatoIl;

    @PrePersist
    protected void onCreate() {
        this.creatoIl = LocalDateTime.now();
    }

    public enum Stato {
        CONFERMATO,
        CANCELLATO,
        COMPLETATO
    }
}