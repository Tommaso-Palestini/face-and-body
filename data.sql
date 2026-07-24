-- ============================================
-- Face and Body - Dati di popolamento
-- ============================================

USE faceandbody;

-- Utenti: 1 Admin + 2 Clienti (per dimostrare il controllo ownership)
-- Password in chiaro corrispondenti agli hash BCrypt:
--   admin@faceandbody.com  -> admin12345
--   mario.rossi@test.com   -> password123
--   giulia.bianchi@test.com -> password123
INSERT INTO utenti (nome, cognome, email, password, ruolo, attivo, data_registrazione) VALUES
('Admin', 'Sistema', 'admin@faceandbody.com', '$2b$10$bkaae9zcQ49X1jriB4Ns5un9S2G8AJbVu6djqurKLGAimgrf5U03m', 'ADMIN', 1, NOW()),
('Mario', 'Rossi', 'mario.rossi@test.com', '$2b$10$rvGWATnYGGDf.424OoVzQeuFDZmLSSzRxgvXqIKlmArmqW6HSM4Ta', 'CLIENTE', 1, NOW()),
('Giulia', 'Bianchi', 'giulia.bianchi@test.com', '$2b$10$rvGWATnYGGDf.424OoVzQeuFDZmLSSzRxgvXqIKlmArmqW6HSM4Ta', 'CLIENTE', 1, NOW());

-- Operatrici
INSERT INTO operatrici (nome, attiva) VALUES
('Debora', 1),
('Miriam', 1),
('Irene', 1);

-- Cabine (dal gestionale)
INSERT INTO cabine (nome, tipo, attiva) VALUES
('Cabina Cera', 'Ceretta', 1),
('Cabina Corpo', 'Trattamenti corpo', 1),
('Cabina Viso', 'Trattamenti viso', 1),
('Manicure', 'Postazione manicure', 1),
('Pedicure', 'Postazione pedicure', 1);

-- Servizi
INSERT INTO servizi (nome, descrizione, prezzo, durata_muniti, disponibile) VALUES
('Manicure Classica', 'Trattamento completo per unghie e cuticole', 25.00, 45, 1),
('Massaggio Rilassante', 'Massaggio total body anti-stress', 50.00, 60, 1),
('Trattamento Viso Idratante', 'Pulizia e idratazione profonda del viso', 40.00, 50, 1),
('Pedicure Spa', 'Trattamento completo per i piedi', 35.00, 50, 1);

-- Pacchetti
INSERT INTO pacchetti (nome, descrizione, prezzo, disponibile) VALUES
('Pacchetto Relax 5 Massaggi', 'Cinque sedute di massaggio rilassante a prezzo scontato', 220.00, 1);

-- Collegamento Pacchetto-Servizi (il pacchetto "Relax 5 Massaggi" include il Massaggio Rilassante x5)
INSERT INTO pacchetto_servizi (pacchetto_id, servizio_id, quantita_inclusa) VALUES
(1, 2, 5);

-- Appuntamento di esempio per Mario (già completato, per poter testare le recensioni)
INSERT INTO appuntamenti (utente_id, servizio_id, data_ora, stato, creato_il) VALUES
(2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'COMPLETATO', DATE_SUB(NOW(), INTERVAL 5 DAY));