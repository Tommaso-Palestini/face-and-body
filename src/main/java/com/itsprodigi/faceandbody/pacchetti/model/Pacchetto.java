package com.itsprodigi.faceandbody.pacchetti.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pacchetti")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pacchetto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String nome; // es. "Pacchetto 5 Massaggi"

    @Column(length = 500)
    private String descrizione;

    @Positive
    @Column(nullable = false)
    private BigDecimal prezzo;

    @Column(nullable = false)
    @Builder.Default
    private boolean disponibile = true;

    // OneToMany verso PacchettoServizio (entità ponte)
    @OneToMany(mappedBy = "pacchetto", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PacchettoServizio> servizi = new ArrayList<>();
}