
package com.itsprodigi.faceandbody.utenti.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.itsprodigi.faceandbody.appuntamenti.model.Appuntamento;
import com.itsprodigi.faceandbody.pacchetti.model.AbbonamentoUtente;
import java.util.ArrayList;
import java.util.List;


import java.time.LocalDateTime;

@Entity
@Table(name = "utenti")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @NotBlank
    @Column(nullable = false)
    private String cognome;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password; // verrà salvata già hashata (BCrypt) dal Service

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Ruolo ruolo = Ruolo.CLIENTE;

    @Column(nullable = false)
    @Builder.Default
    private boolean attivo = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataRegistrazione;

    @OneToMany(mappedBy = "utente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Appuntamento> appuntamenti = new ArrayList<>();

    @OneToMany(mappedBy = "utente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AbbonamentoUtente> abbonamenti = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dataRegistrazione = LocalDateTime.now();
    }

    public enum Ruolo {
        CLIENTE,
        ADMIN
    }
}