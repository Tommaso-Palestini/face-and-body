package com.itsprodigi.faceandbody.pacchetti.model;

import com.itsprodigi.faceandbody.servizi.model.Servizio;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "pacchetto_servizi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacchettoServizio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ManyToOne verso Pacchetto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pacchetto_id", nullable = false)
    private Pacchetto pacchetto;

    // ManyToOne verso Servizio — insieme danno la ManyToMany
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servizio_id", nullable = false)
    private Servizio servizio;

    @Positive
    @Column(nullable = false)
    private Integer quantitaInclusa; // es. 5 sessioni di massaggio incluse nel pacchetto
}