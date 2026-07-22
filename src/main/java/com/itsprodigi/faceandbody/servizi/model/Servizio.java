package com.itsprodigi.faceandbody.servizi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "servizi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servizio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String nome; // es. "Manicure", "Massaggio rilassante"

    @Column(length = 500)
    private String descrizione;

    @Positive
    @Column(nullable = false)
    private BigDecimal prezzo; // BigDecimal per i soldi, mai double/float

    @Positive
    @Column(nullable = false)
    private Integer durataMuniti; // durata in minuti

    @Column(nullable = false)
    @Builder.Default
    private boolean disponibile = true; // Admin può disattivare un servizio senza eliminarlo
}