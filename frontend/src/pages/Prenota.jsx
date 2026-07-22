import { useState, useEffect, useMemo } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { FaCalendarAlt, FaClock, FaTrash } from 'react-icons/fa';

const ORARI_DISPONIBILI = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

function formatDataOraISO(data, orario) {
  const [ore, minuti] = orario.split(':');
  const d = new Date(data);
  d.setHours(Number(ore), Number(minuti), 0, 0);
  // formato locale senza fuso, come si aspetta il backend (LocalDateTime)
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

function GateAccesso() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: 'linear-gradient(rgba(36,57,42,0.75), rgba(36,57,42,0.75))',
        padding: '6rem 0',
        textAlign: 'center',
        color: '#F7F1E6',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container>
        <FaCalendarAlt size={50} style={{ marginBottom: '1.5rem', opacity: 0.9 }} />
        <h1 style={{ color: '#F7F1E6' }}>Accedi per prenotare un appuntamento</h1>
        <p style={{ maxWidth: '500px', margin: '0 auto 2rem', opacity: 0.9 }}>
          Per prenotare un trattamento, effettua l'accesso o crea un account in pochi secondi.
        </p>
        <div>
          <Button
            variant="outline-light"
            size="lg"
            className="me-3"
            onClick={() => navigate('/login', { state: { from: '/prenota' } })}
          >
            Accedi
          </Button>
          <Button
            size="lg"
            style={{ backgroundColor: '#6B8F71', borderColor: '#6B8F71' }}
            onClick={() => navigate('/registrati')}
          >
            Registrati
          </Button>
        </div>
      </Container>
    </div>
  );
}

function Calendario() {
  const { token } = useAuth();

  const [servizi, setServizi] = useState([]);
  const [servizioId, setServizioId] = useState('');
  const [meseVisualizzato, setMeseVisualizzato] = useState(new Date());
  const [slotOccupati, setSlotOccupati] = useState([]);
  const [giornoSelezionato, setGiornoSelezionato] = useState(null);
  const [orarioSelezionato, setOrarioSelezionato] = useState(null);

  const [mieiAppuntamenti, setMieiAppuntamenti] = useState([]);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [caricamento, setCaricamento] = useState(false);

  // Carica il catalogo servizi una volta
  useEffect(() => {
    apiFetch('/api/servizi', token)
      .then((data) => {
        setServizi(data);
        if (data.length > 0) setServizioId(String(data[0].id));
      })
      .catch((err) => setErrore(err.message));
  }, [token]);

  // Carica i miei appuntamenti
  function caricaMieiAppuntamenti() {
    apiFetch('/api/appuntamenti/miei', token)
      .then(setMieiAppuntamenti)
      .catch((err) => setErrore(err.message));
  }
  useEffect(caricaMieiAppuntamenti, [token]);

  // Carica gli slot occupati quando cambia servizio o mese
  useEffect(() => {
    if (!servizioId) return;
    const inizio = new Date(meseVisualizzato.getFullYear(), meseVisualizzato.getMonth(), 1);
    const fine = new Date(meseVisualizzato.getFullYear(), meseVisualizzato.getMonth() + 1, 0, 23, 59, 59);

    const inizioStr = formatDataOraISO(inizio, '00:00');
    const fineStr = formatDataOraISO(fine, '23:59');

    apiFetch(
      `/api/appuntamenti/disponibilita?servizioId=${servizioId}&inizio=${inizioStr}&fine=${fineStr}`,
      token
    )
      .then(setSlotOccupati)
      .catch((err) => setErrore(err.message));
  }, [servizioId, meseVisualizzato, token]);

  const orariOccupatiPerGiorno = useMemo(() => {
    if (!giornoSelezionato) return [];
    const giornoStr = giornoSelezionato.toDateString();
    return slotOccupati
      .filter((iso) => new Date(iso).toDateString() === giornoStr)
      .map((iso) => {
        const d = new Date(iso);
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      });
  }, [giornoSelezionato, slotOccupati]);

  async function handlePrenota() {
    setErrore(null);
    setMessaggio(null);
    setCaricamento(true);
    try {
      const dataOra = formatDataOraISO(giornoSelezionato, orarioSelezionato);
      await apiFetch('/api/appuntamenti', token, {
        method: 'POST',
        body: JSON.stringify({ servizioId: Number(servizioId), dataOra }),
      });
      setMessaggio('Appuntamento prenotato con successo!');
      setOrarioSelezionato(null);
      setGiornoSelezionato(null);
      caricaMieiAppuntamenti();
      // ricarica disponibilità
      setMeseVisualizzato(new Date(meseVisualizzato));
    } catch (err) {
      setErrore(err.message);
    } finally {
      setCaricamento(false);
    }
  }

  async function handleCancella(id) {
    setErrore(null);
    setMessaggio(null);
    try {
      await apiFetch(`/api/appuntamenti/${id}`, token, { method: 'DELETE' });
      setMessaggio('Appuntamento cancellato.');
      caricaMieiAppuntamenti();
    } catch (err) {
      setErrore(err.message);
    }
  }

  const giorniOccupatiCompleti = useMemo(() => {
    // un giorno è "pieno" se tutti gli orari disponibili sono occupati
    const mappa = {};
    slotOccupati.forEach((iso) => {
      const giorno = new Date(iso).toDateString();
      mappa[giorno] = (mappa[giorno] || 0) + 1;
    });
    return Object.keys(mappa).filter((giorno) => mappa[giorno] >= ORARI_DISPONIBILI.length);
  }, [slotOccupati]);

  return (
    <Container style={{ padding: '3rem 1rem', minHeight: '70vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Prenota un Appuntamento</h1>

      {errore && <Alert variant="danger" onClose={() => setErrore(null)} dismissible>{errore}</Alert>}
      {messaggio && <Alert variant="success" onClose={() => setMessaggio(null)} dismissible>{messaggio}</Alert>}

      <Row className="gy-4">
        <Col lg={7}>
          <Form.Group className="mb-3">
            <Form.Label>Scegli il servizio</Form.Label>
            <Form.Select value={servizioId} onChange={(e) => { setServizioId(e.target.value); setGiornoSelezionato(null); }}>
              {servizi.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} — {s.durataMuniti} min — €{s.prezzo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div style={{ backgroundColor: '#EFE6D8', borderRadius: '12px', padding: '1rem' }}>
            <DayPicker
              mode="single"
              selected={giornoSelezionato}
              onSelect={(giorno) => { setGiornoSelezionato(giorno); setOrarioSelezionato(null); }}
              onMonthChange={setMeseVisualizzato}
              disabled={[{ before: new Date() }, ...giorniOccupatiCompleti.map((g) => new Date(g))]}
              modifiersStyles={{
                selected: { backgroundColor: '#3B5D45' },
              }}
            />
          </div>

          {giornoSelezionato && (
            <div className="mt-3">
              <h5>Orari disponibili per {giornoSelezionato.toLocaleDateString('it-IT')}</h5>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {ORARI_DISPONIBILI.map((orario) => {
                  const occupato = orariOccupatiPerGiorno.includes(orario);
                  return (
                    <Button
                      key={orario}
                      disabled={occupato}
                      variant={orarioSelezionato === orario ? 'success' : 'outline-secondary'}
                      style={
                        orarioSelezionato === orario
                          ? { backgroundColor: '#3B5D45', borderColor: '#3B5D45' }
                          : {}
                      }
                      onClick={() => setOrarioSelezionato(orario)}
                    >
                      {orario}
                    </Button>
                  );
                })}
              </div>

              {orarioSelezionato && (
                <Button
                  className="mt-3"
                  disabled={caricamento}
                  style={{ backgroundColor: '#6B8F71', borderColor: '#6B8F71' }}
                  onClick={handlePrenota}
                >
                  {caricamento ? 'Prenotazione in corso...' : `Conferma per le ${orarioSelezionato}`}
                </Button>
              )}
            </div>
          )}
        </Col>

        <Col lg={5}>
          <h5 style={{ marginBottom: '1rem' }}>I tuoi appuntamenti</h5>
          {mieiAppuntamenti.length === 0 && <p style={{ opacity: 0.7 }}>Nessun appuntamento prenotato.</p>}
          {mieiAppuntamenti.map((app) => (
            <Card key={app.id} style={{ backgroundColor: '#EFE6D8', border: 'none', marginBottom: '0.8rem' }}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{app.servizioNome}</strong>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    <FaClock style={{ marginRight: '0.3rem' }} />
                    {new Date(app.dataOra).toLocaleString('it-IT', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                  <Badge style={{ backgroundColor: app.stato === 'CANCELLATO' ? '#a94442' : '#3B5D45', marginTop: '0.3rem' }}>
                    {app.stato}
                  </Badge>
                </div>
                {app.stato === 'CONFERMATO' && (
                  <Button variant="outline-danger" size="sm" onClick={() => handleCancella(app.id)}>
                    <FaTrash />
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

function Prenota() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Calendario /> : <GateAccesso />;
}

export default Prenota;