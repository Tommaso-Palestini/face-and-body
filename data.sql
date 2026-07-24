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

-- Servizi reali
INSERT INTO servizi (nome, descrizione, prezzo, durata_muniti, disponibile) VALUES
('Pedicure con Semipermanente', 'Pedicure con applicazione smalto semipermanente', 55.00, 75, 1),
('Pedicure Happy Feet', 'Trattamento pedicure completo e rilassante', 60.00, 75, 1),
('Rimozione Semipermanente Piedi', 'Rimozione smalto semipermanente dai piedi', 10.00, 15, 1),
('Season Spa', 'Trattamento spa stagionale total relax', 88.00, 90, 1),
('Pulizia Viso', 'Pulizia viso profonda professionale', 75.00, 90, 1),
('Trattamento Viso Flash', 'Trattamento viso rapido rinfrescante', 30.00, 30, 1),
('Trattamento Viso Natì - Blanc Whitening', 'Trattamento viso schiarente e uniformante', 100.00, 60, 1),
('Trattamento Viso Natì - Blu Hydra', 'Trattamento viso idratante intensivo', 80.00, 60, 1),
('Trattamento Viso Natì - Green Age', 'Trattamento viso anti-età', 100.00, 60, 1),
('Trattamento Viso Natì - Orange Purity', 'Trattamento viso purificante', 75.00, 60, 1),
('Manicure', 'Manicure classica', 19.00, 45, 1),
('Manicure Spa', 'Manicure con trattamento spa mani', 30.00, 60, 1),
('Applicazione Smalto Semipermanente Piedi', 'Applicazione smalto semipermanente sui piedi', 30.00, 30, 1),
('Trattamento Viso/Corpo Natì - Klimakter', 'Trattamento viso e corpo specifico menopausa', 160.00, 105, 1),
('Bendaggio Natì', 'Bendaggio corpo drenante e rimodellante', 59.00, 45, 1),
('Scrub', 'Scrub corpo esfoliante', 59.00, 60, 1),
('Trattamenti Corpo Biotech', 'Trattamento corpo con tecnologia biotech', 70.00, 60, 1),
('Trattamento Corpo Natì - 3D', 'Trattamento corpo rimodellante 3D', 80.00, 60, 1),
('Trattamento Corpo Natì - Humus Fans', 'Trattamento corpo rigenerante', 80.00, 60, 1),
('Trattamento Corpo Natì - White Model', 'Trattamento corpo schiarente e modellante', 110.00, 75, 1),
('Trattamento Natì Water Massage', 'Massaggio corpo ad effetto acqua', 75.00, 60, 1),
('Consulenza Viso', 'Consulenza personalizzata per la pelle del viso', 75.00, 90, 1),
('D.E.M.', 'Trattamento drenaggio elettro-manuale', 30.00, 45, 1),
('Epilazione a Cera Sopracciglia', 'Epilazione a cera delle sopracciglia', 10.00, 15, 1),
('Epilazione a Cera Ascelle', 'Epilazione a cera delle ascelle', 10.00, 15, 1),
('Epilazione a Cera Coscia', 'Epilazione a cera della coscia', 17.00, 30, 1),
('Epilazione a Cera Gamba', 'Epilazione a cera della gamba', 30.00, 45, 1),
('Epilazione a Cera Labbro Superiore', 'Epilazione a cera del labbro superiore', 7.00, 15, 1),
('Epilazione a Cera Mezza Gamba', 'Epilazione a cera di mezza gamba', 13.00, 30, 1),
('Epilazione a Cera Sopracciglia e Labbro Superiore', 'Epilazione a cera sopracciglia e labbro superiore', 17.00, 15, 1),
('Epilazione a Cera Total Body', 'Epilazione a cera corpo completo', 78.00, 60, 1),
('Epilazione a Cera Viso', 'Epilazione a cera del viso', 20.00, 30, 1);

-- Pacchetti
INSERT INTO pacchetti (nome, descrizione, prezzo, disponibile) VALUES
('Pacchetto Relax 5 Massaggi', 'Cinque sedute di massaggio rilassante a prezzo scontato', 220.00, 1);

-- Collegamento Pacchetto-Servizi (il pacchetto "Relax 5 Massaggi" include il Massaggio Rilassante x5)
INSERT INTO pacchetto_servizi (pacchetto_id, servizio_id, quantita_inclusa) VALUES
(1, 2, 5);

-- Appuntamento di esempio per Mario (già completato, per poter testare le recensioni)
INSERT INTO appuntamenti (utente_id, servizio_id, data_ora, stato, creato_il) VALUES
(2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'COMPLETATO', DATE_SUB(NOW(), INTERVAL 5 DAY));