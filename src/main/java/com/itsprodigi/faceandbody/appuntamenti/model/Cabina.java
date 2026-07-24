package com.itsprodigi.faceandbody.appuntamenti.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cabine")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cabina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    @Builder.Default
    private boolean attiva = true;
}