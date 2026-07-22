package com.itsprodigi.faceandbody.utenti.service;

import com.itsprodigi.faceandbody.common.exception.BusinessException;
import com.itsprodigi.faceandbody.security.jwt.JwtUtil;
import com.itsprodigi.faceandbody.utenti.dto.*;
import com.itsprodigi.faceandbody.utenti.model.Utente;
import com.itsprodigi.faceandbody.utenti.repository.UtenteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UtenteService {

    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UtenteService(
            UtenteRepository utenteRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public UtenteResponse registra(UtenteRegistrazioneRequest request) {
        if (utenteRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email già registrata", HttpStatus.CONFLICT);
        }

        Utente utente = Utente.builder()
                .nome(request.nome())
                .cognome(request.cognome())
                .email(request.email())
                .password(passwordEncoder.encode(request.password())) // mai testo in chiaro
                .ruolo(Utente.Ruolo.CLIENTE) // registrazione pubblica = sempre CLIENTE
                .build();

        utente = utenteRepository.save(utente);
        return toResponse(utente);
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        Utente utente = utenteRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Utente non trovato", HttpStatus.NOT_FOUND));

        return new LoginResponse(token, utente.getEmail(), utente.getNome(), utente.getRuolo().name());
    }

    public UtenteResponse trovaPerId(Long id) {
        Utente utente = utenteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Utente non trovato", HttpStatus.NOT_FOUND));
        return toResponse(utente);
    }

    public java.util.List<UtenteResponse> trovaTutti() {
        return utenteRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private UtenteResponse toResponse(Utente utente) {
        return new UtenteResponse(
                utente.getId(),
                utente.getNome(),
                utente.getCognome(),
                utente.getEmail(),
                utente.getRuolo().name(),
                utente.isAttivo(),
                utente.getDataRegistrazione()
        );
    }
}