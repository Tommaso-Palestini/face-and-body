package com.itsprodigi.faceandbody.security;

import com.itsprodigi.faceandbody.utenti.model.Utente;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UtenteDetails implements UserDetails {

    private final Utente utente;

    public UtenteDetails(Utente utente) {
        this.utente = utente;
    }

    public Utente getUtente() {
        return utente;
    }

    public Long getId() {
        return utente.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Spring Security richiede il prefisso "ROLE_" per i ruoli
        return List.of(new SimpleGrantedAuthority("ROLE_" + utente.getRuolo().name()));
    }

    @Override
    public String getPassword() {
        return utente.getPassword();
    }

    @Override
    public String getUsername() {
        return utente.getEmail(); // usiamo l'email come username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return utente.isAttivo(); // rispetta il flag "attivo" dell'utente
    }
}