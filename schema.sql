-- ============================================
-- Face and Body - Schema Database
-- ============================================

CREATE DATABASE IF NOT EXISTS faceandbody
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE faceandbody;

-- Utenti (modulo obbligatorio)
CREATE TABLE utenti (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cognome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    ruolo ENUM('CLIENTE', 'ADMIN') NOT NULL,
    attivo BIT NOT NULL DEFAULT 1,
    data_registrazione DATETIME(6) NOT NULL
) ENGINE=InnoDB;

-- Servizi
CREATE TABLE servizi (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descrizione VARCHAR(500),
    prezzo DECIMAL(10,2) NOT NULL,
    durata_muniti INT NOT NULL,
    disponibile BIT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Operatrici
CREATE TABLE operatrici (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    attiva BIT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Cabine
CREATE TABLE cabine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    attiva BIT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Appuntamenti
CREATE TABLE appuntamenti (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    utente_id BIGINT NOT NULL,
    servizio_id BIGINT NOT NULL,
    data_ora DATETIME(6) NOT NULL,
    stato ENUM('CONFERMATO', 'CANCELLATO', 'COMPLETATO') NOT NULL,
    creato_il DATETIME(6) NOT NULL,
    CONSTRAINT fk_appuntamenti_utente FOREIGN KEY (utente_id) REFERENCES utenti(id),
    CONSTRAINT fk_appuntamenti_servizio FOREIGN KEY (servizio_id) REFERENCES servizi(id),
    operatrice_id BIGINT,
    cabina_id BIGINT
) ENGINE=InnoDB;

-- Recensioni (relazione OneToOne con Appuntamento)
CREATE TABLE recensioni (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appuntamento_id BIGINT NOT NULL UNIQUE,
    utente_id BIGINT NOT NULL,
    voto INT NOT NULL CHECK (voto BETWEEN 1 AND 5),
    commento VARCHAR(1000) NOT NULL,
    creato_il DATETIME(6) NOT NULL,
    CONSTRAINT fk_recensioni_appuntamento FOREIGN KEY (appuntamento_id) REFERENCES appuntamenti(id),
    CONSTRAINT fk_recensioni_utente FOREIGN KEY (utente_id) REFERENCES utenti(id)
) ENGINE=InnoDB;

-- Pacchetti
CREATE TABLE pacchetti (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descrizione VARCHAR(500),
    prezzo DECIMAL(10,2) NOT NULL,
    disponibile BIT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- Pacchetto-Servizi (entità ponte per la relazione ManyToMany con attributo extra)
CREATE TABLE pacchetto_servizi (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pacchetto_id BIGINT NOT NULL,
    servizio_id BIGINT NOT NULL,
    quantita_inclusa INT NOT NULL,
    CONSTRAINT fk_ps_pacchetto FOREIGN KEY (pacchetto_id) REFERENCES pacchetti(id),
    CONSTRAINT fk_ps_servizio FOREIGN KEY (servizio_id) REFERENCES servizi(id)
) ENGINE=InnoDB;

-- Abbonamenti Utenti
CREATE TABLE abbonamenti_utenti (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    utente_id BIGINT NOT NULL,
    pacchetto_id BIGINT NOT NULL,
    sessioni_rimanenti INT NOT NULL,
    stato ENUM('ATTIVO', 'ESAURITO', 'CANCELLATO') NOT NULL,
    acquistato_il DATETIME(6) NOT NULL,
    CONSTRAINT fk_abbonamenti_utente FOREIGN KEY (utente_id) REFERENCES utenti(id),
    CONSTRAINT fk_abbonamenti_pacchetto FOREIGN KEY (pacchetto_id) REFERENCES pacchetti(id)
) ENGINE=InnoDB;