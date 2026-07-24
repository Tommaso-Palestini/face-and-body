# Face and Body — Full Stack

Applicazione full stack per la gestione di un centro estetico: backend Java (API REST) + frontend React. Gestisce utenti, servizi, appuntamenti (con operatrici e cabine), recensioni e pacchetti/abbonamenti, con autenticazione JWT e autorizzazione basata su ruoli e ownership.

Project work finale — UF14 Java Backend, ITS Prodigi (Full Stack Developer).

## Stack tecnologico

**Backend**
- Java 21, Spring Boot 4.0.7 (Web, Data JPA, Security, Validation)
- MySQL 8.4
- JWT (jjwt 0.12.6)
- JUnit 5 + Mockito + AssertJ
- JaCoCo (copertura test)
- Maven

**Frontend**
- Vite + React
- React Router
- React Bootstrap
- react-day-picker (calendario prenotazioni)
- react-icons

**Infrastruttura**
- Docker & Docker Compose

## Prerequisiti

- Docker e Docker Compose (per il backend)
- Node.js 18+ e npm (per il frontend)

## Avvio del backend

Dalla root del progetto:

```bash
docker compose up --build
```

Builda l'immagine dell'applicazione (build multi-stage) e avvia insieme MySQL e l'app. L'API sarà su:

http://localhost:8080

Per fermare l'ambiente: `docker compose down`. Per azzerare anche i dati: `docker compose down -v`.

## Popolamento del database

```bash
docker compose down -v
docker volume rm faceandbody_mysql_data
docker compose up -d mysql
```

Attendere ~15 secondi, poi:

```bash
docker exec -i faceandbody-mysql mysql -u root -prootpassword < schema.sql
docker exec -i faceandbody-mysql mysql -u root -prootpassword < data.sql
docker compose up --build -d app
```

`schema.sql` crea la struttura completa (utenti, servizi, appuntamenti, recensioni, pacchetti, abbonamenti, operatrici, cabine). `data.sql` popola con: un Admin, due Clienti, il catalogo servizi reale, le tre operatrici, le cinque cabine, e un pacchetto/appuntamento di esempio.

## Avvio del frontend

```bash
cd frontend
npm install
npm run dev
```

Il sito sarà su:

http://localhost:5173

Il backend deve essere già avviato: il frontend chiama le API su `http://localhost:8080`.

## Utenti di test

| Ruolo | Email | Password |
|---|---|---|
| Admin | `admin@faceandbody.com` | `admin12345` |
| Cliente | `mario.rossi@test.com` | `password123` |
| Cliente | `giulia.bianchi@test.com` | `password123` |

## Funzionalità

**Pubblico**: Home, catalogo Servizi, catalogo Pacchetti, Chi Siamo, registrazione, login.

**Cliente**: calendario prenotazioni con disponibilità in tempo reale e scelta operatrice, gestione dei propri appuntamenti, acquisto pacchetti, i propri abbonamenti, recensioni sui trattamenti completati.

**Admin**: gestione servizi (crea/modifica/disattiva), gestione pacchetti (crea/modifica/disattiva, con servizi inclusi), vista su tutti gli appuntamenti con filtro per data, creazione di appuntamenti per conto di un cliente (con scelta di operatrice e cabina), completamento appuntamenti, stampa dell'agenda giornaliera con riepilogo, vista sulle recensioni ricevute.

## Autenticazione

1. `POST /api/auth/registrazione` — crea un nuovo utente (ruolo CLIENTE)
2. `POST /api/auth/login` — restituisce un token JWT
3. Includere il token nelle richieste successive: `Authorization: Bearer <token>`

## Endpoint principali

| Metodo | Endpoint | Accesso |
|---|---|---|
| POST | `/api/auth/registrazione` | Pubblico |
| POST | `/api/auth/login` | Pubblico |
| GET | `/api/servizi` | Pubblico |
| POST / PUT / DELETE | `/api/servizi/**` | Admin |
| GET | `/api/appuntamenti/operatrici` | Pubblico |
| GET | `/api/appuntamenti/cabine` | Pubblico |
| POST | `/api/appuntamenti` | Autenticato |
| GET | `/api/appuntamenti/miei` | Autenticato |
| GET | `/api/appuntamenti/disponibilita` | Autenticato |
| DELETE | `/api/appuntamenti/{id}` | Proprietario o Admin |
| PATCH | `/api/appuntamenti/{id}/completa` | Admin |
| POST | `/api/appuntamenti/admin/prenota/{utenteId}` | Admin |
| GET | `/api/appuntamenti/admin/tutti` | Admin |
| POST | `/api/recensioni` | Autenticato |
| GET | `/api/recensioni` | Admin |
| GET | `/api/pacchetti` | Pubblico |
| POST / PUT / DELETE | `/api/pacchetti/**` | Admin |
| POST | `/api/pacchetti/{id}/acquista` | Autenticato |
| GET | `/api/pacchetti/miei-abbonamenti` | Autenticato |
| GET / PATCH | `/api/pacchetti/admin/abbonamenti/**` | Admin |
| GET | `/api/utenti` | Admin |

L'elenco completo, con esempi di richiesta/risposta, è nella Postman Collection allegata.

## Testare con Postman

Importare `Face-and-Body-API.postman_collection.json` e `face-and-body-Local.postman_environment.json`. Selezionare l'environment, eseguire le richieste di login (Auth → Login Mario / Login Giulia / Login Admin): il token viene salvato automaticamente e riutilizzato dalle altre richieste.

## Eseguire i test e la copertura

```bash
mvn clean test
```

Report di copertura in `target/site/jacoco/index.html`.

## Struttura del progetto

├── src/main/java/com/itsprodigi/faceandbody/
│ ├── utenti/ # Gestione utenti, registrazione, login
│ ├── servizi/ # Catalogo servizi
│ ├── appuntamenti/ # Prenotazioni, disponibilità, operatrici, cabine
│ ├── recensioni/ # Recensioni sugli appuntamenti completati
│ ├── pacchetti/ # Pacchetti/abbonamenti
│ ├── security/ # Configurazione Spring Security, JWT, CORS
│ └── common/ # Eccezioni ed exception handler condivisi
└── frontend/
└── src/
├── pages/ # Home, Servizi, Pacchetti, ChiSiamo, Login, Registrati, Prenota, MieiAbbonamenti, MieRecensioni, Admin
├── components/ # Navbar, Footer
├── context/ # AuthContext (stato login, JWT)
└── utils/ # Helper per le chiamate API autenticate

## Deliverable inclusi

- Codice sorgente completo (backend + frontend)
- `schema.sql` + `data.sql`
- `Dockerfile` + `docker-compose.yml`
- `Face-and-Body-API.postman_collection.json` + environment
- `Relazione_Tecnica_FaceAndBody.docx`