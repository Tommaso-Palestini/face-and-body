# Face and Body — Backend

Backend Java per la gestione di un centro estetico: utenti, servizi, appuntamenti, recensioni e pacchetti/abbonamenti, con autenticazione JWT e autorizzazione basata su ruoli e ownership.

Project work finale — UF14 Java Backend, ITS Prodigi (Full Stack Developer).

## Stack tecnologico

- Java 21
- Spring Boot 4.0.7 (Web, Data JPA, Security, Validation)
- MySQL 8.4
- JWT (jjwt 0.12.6)
- JUnit 5 + Mockito + AssertJ
- JaCoCo (copertura test)
- Docker & Docker Compose
- Maven

## Prerequisiti

- Docker e Docker Compose installati
- (Solo per sviluppo locale senza Docker) JDK 21 e Maven 3.8+

Non serve installare Java, Maven o MySQL sulla macchina se si usa Docker: l'intero ambiente è containerizzato.

## Avvio rapido

Dalla root del progetto:

```bash
docker compose up --build
```

Il comando builda l'immagine dell'applicazione (build multi-stage) e avvia insieme il container MySQL e il container dell'app. L'app attende automaticamente che il database sia pronto (`healthcheck`) prima di avviarsi.

L'API sarà raggiungibile su:

```
http://localhost:8080
```

Per fermare l'ambiente:

```bash
docker compose down
```

Per fermarlo e rimuovere anche i dati del database (riparte da zero):

```bash
docker compose down -v
```

## Popolamento del database

Il database viene creato vuoto al primo avvio (Hibernate genera lo schema). Per popolarlo con dati di esempio pronti all'uso — utili anche per testare subito la Postman Collection — eseguire, a container MySQL avviato:

```bash
docker exec -i faceandbody-mysql mysql -u root -prootpassword < schema.sql
docker exec -i faceandbody-mysql mysql -u root -prootpassword < data.sql
```

`schema.sql` crea la struttura completa del database; `data.sql` inserisce un set minimo di dati: un utente Admin, due utenti Cliente, un catalogo di servizi, un pacchetto di esempio e un appuntamento già completato (utile per testare subito le recensioni).

## Utenti di test

| Ruolo | Email | Password |
|---|---|---|
| Admin | `admin@faceandbody.com` | `admin12345` |
| Cliente | `mario.rossi@test.com` | `password123` |
| Cliente | `giulia.bianchi@test.com` | `password123` |

Sono presenti due utenti Cliente distinti per poter verificare il controllo di autorizzazione a livello di risorsa: un cliente può leggere, modificare o cancellare solo i propri appuntamenti; un Admin può operare su tutto.

## Autenticazione

1. `POST /api/auth/registrazione` — crea un nuovo utente (ruolo CLIENTE)
2. `POST /api/auth/login` — restituisce un token JWT
3. Includere il token nelle richieste successive con l'header:

```
Authorization: Bearer <token>
```

## Endpoint principali

| Metodo | Endpoint | Accesso |
|---|---|---|
| POST | `/api/auth/registrazione` | Pubblico |
| POST | `/api/auth/login` | Pubblico |
| GET | `/api/servizi` | Pubblico |
| POST / PUT / DELETE | `/api/servizi/**` | Admin |
| POST | `/api/appuntamenti` | Autenticato |
| GET | `/api/appuntamenti/miei` | Autenticato |
| GET | `/api/appuntamenti/disponibilita` | Autenticato |
| DELETE | `/api/appuntamenti/{id}` | Proprietario o Admin |
| PATCH | `/api/appuntamenti/{id}/completa` | Admin |
| POST | `/api/recensioni` | Autenticato |
| GET | `/api/pacchetti` | Pubblico |
| POST | `/api/pacchetti/{id}/acquista` | Autenticato |
| GET | `/api/utenti` | Admin |

L'elenco completo degli endpoint, con esempi di richiesta/risposta, è nella Postman Collection allegata.

## Testare con Postman

Importare in Postman i due file forniti:

- `Face-and-Body-API.postman_collection.json` — tutte le richieste, organizzate per modulo
- `face-and-body-Local.postman_environment.json` — variabili d'ambiente (`base_url`, token)

Selezionare l'environment importato, eseguire le richieste di login (Auth → Login Mario / Login Giulia / Login Admin): il token viene salvato automaticamente nelle variabili d'ambiente e riutilizzato dalle altre richieste.

## Eseguire i test e la copertura

```bash
mvn clean test
```

Il report di copertura JaCoCo viene generato in `target/site/jacoco/index.html`.

## Struttura del progetto

```
src/main/java/com/itsprodigi/faceandbody/
├── utenti/          # Gestione utenti, registrazione, login
├── servizi/         # Catalogo servizi
├── appuntamenti/    # Prenotazioni e controllo disponibilità
├── recensioni/      # Recensioni sugli appuntamenti completati
├── pacchetti/       # Pacchetti/abbonamenti
├── security/        # Configurazione Spring Security e JWT
└── common/          # Eccezioni ed exception handler condivisi
```

Ogni modulo segue la stessa struttura interna: `controller/`, `service/`, `repository/`, `model/`, `dto/`.

## Deliverable inclusi

- Codice sorgente completo
- `schema.sql` — struttura del database
- `data.sql` — dati di popolamento
- `Dockerfile` — build multi-stage dell'applicazione
- `docker-compose.yml` — orchestrazione app + database
- `Face-and-Body-API.postman_collection.json` + environment
- `Relazione_Tecnica_FaceAndBody.docx` — relazione tecnica del progetto
