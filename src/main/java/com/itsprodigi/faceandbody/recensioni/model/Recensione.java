package com.itsprodigi.faceandbody.recensioni.model;

import com.itsprodigi.faceandbody.appuntamenti.model.Appuntamento;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recensioni")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recensione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // OneToOne: un appuntamento ha al massimo una recensione
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appuntamento_id", nullable = false, unique = true)
    private Appuntamento appuntamento;

    // ManyToOne: un cliente può fare più recensioni
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer voto; // da 1 a 5 stelle

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String commento;

    @Column(nullable = false, updatable = false)
    private LocalDateTime creatoIl;

    @PrePersist
    protected void onCreate() {
        this.creatoIl = LocalDateTime.now();
    }
}