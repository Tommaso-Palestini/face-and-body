package com.itsprodigi.faceandbody.appuntamenti.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "operatrici")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operatrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    @Builder.Default
    private boolean attiva = true;
}