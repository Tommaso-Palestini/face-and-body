import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { FaStar, FaRegStar } from 'react-icons/fa';

function StelleVoto({ voto, onChange }) {
  return (
    <div style={{ fontSize: '1.5rem', cursor: onChange ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map((n) =>
        n <= voto ? (
          <FaStar key={n} style={{ color: '#3B5D45' }} onClick={() => onChange && onChange(n)} />
        ) : (
          <FaRegStar key={n} style={{ color: '#3B5D45' }} onClick={() => onChange && onChange(n)} />
        )
      )}
    </div>
  );
}

function MieRecensioni() {
  const { token } = useAuth();

  const [recensioni, setRecensioni] = useState([]);
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);

  const [appuntamentoId, setAppuntamentoId] = useState('');
  const [voto, setVoto] = useState(5);
  const [commento, setCommento] = useState('');
  const [invioInCorso, setInvioInCorso] = useState(false);

  function caricaDati() {
    Promise.all([
      apiFetch('/api/recensioni/mie', token),
      apiFetch('/api/appuntamenti/miei', token),
    ])
      .then(([recensioniData, appuntamentiData]) => {
        setRecensioni(recensioniData);
        // solo appuntamenti completati e non ancora recensiti
        const idRecensiti = recensioniData.map((r) => r.appuntamentoId);
        const completatiSenzaRecensione = appuntamentiData.filter(
          (a) => a.stato === 'COMPLETATO' && !idRecensiti.includes(a.id)
        );
        setAppuntamenti(completatiSenzaRecensione);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  }

  useEffect(caricaDati, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!appuntamentoId) {
      setErrore('Seleziona un appuntamento da recensire');
      return;
    }
    setErrore(null);
    setMessaggio(null);
    setInvioInCorso(true);
    try {
      await apiFetch('/api/recensioni', token, {
        method: 'POST',
        body: JSON.stringify({ appuntamentoId: Number(appuntamentoId), voto, commento }),
      });
      setMessaggio('Recensione pubblicata, grazie per il tuo feedback!');
      setAppuntamentoId('');
      setVoto(5);
      setCommento('');
      caricaDati();
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvioInCorso(false);
    }
  }

  return (
    <Container style={{ padding: '4rem 1rem', minHeight: '65vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Le Mie Recensioni</h1>
      <p style={{ textAlign: 'center', opacity: 0.75, marginBottom: '3rem' }}>
        Racconta la tua esperienza sui trattamenti ricevuti
      </p>

      {errore && <Alert variant="danger" onClose={() => setErrore(null)} dismissible>{errore}</Alert>}
      {messaggio && <Alert variant="success" onClose={() => setMessaggio(null)} dismissible>{messaggio}</Alert>}

      {caricamento ? (
        <div style={{ textAlign: 'center' }}>
          <Spinner animation="border" style={{ color: '#3B5D45' }} />
        </div>
      ) : (
        <Row className="gy-4">
          <Col lg={5}>
            <h5 style={{ marginBottom: '1rem' }}>Lascia una recensione</h5>
            {appuntamenti.length === 0 ? (
              <p style={{ opacity: 0.7 }}>
                Non hai appuntamenti completati da recensire al momento.
              </p>
            ) : (
              <Form onSubmit={handleSubmit} style={{ backgroundColor: '#EFE6D8', padding: '1.5rem', borderRadius: '10px' }}>
                <Form.Group className="mb-3">
                  <Form.Label>Appuntamento</Form.Label>
                  <Form.Select value={appuntamentoId} onChange={(e) => setAppuntamentoId(e.target.value)} required>
                    <option value="">Seleziona...</option>
                    {appuntamenti.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.servizioNome} — {new Date(a.dataOra).toLocaleDateString('it-IT')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Voto</Form.Label>
                  <div>
                    <StelleVoto voto={voto} onChange={setVoto} />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Commento</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={commento}
                    onChange={(e) => setCommento(e.target.value)}
                    required
                    placeholder="Raccontaci la tua esperienza..."
                  />
                </Form.Group>

                <Button type="submit" disabled={invioInCorso} style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }}>
                  {invioInCorso ? 'Invio in corso...' : 'Pubblica recensione'}
                </Button>
              </Form>
            )}
          </Col>

          <Col lg={7}>
            <h5 style={{ marginBottom: '1rem' }}>Le tue recensioni</h5>
            {recensioni.length === 0 && <p style={{ opacity: 0.7 }}>Non hai ancora lasciato recensioni.</p>}
            {recensioni.map((r) => (
              <Card key={r.id} style={{ backgroundColor: '#EFE6D8', border: 'none', marginBottom: '0.8rem' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <StelleVoto voto={r.voto} />
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {new Date(r.creatoIl).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <p style={{ marginBottom: 0, opacity: 0.85 }}>{r.commento}</p>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default MieRecensioni;