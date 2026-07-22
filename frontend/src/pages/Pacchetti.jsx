import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEuroSign, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

function Pacchetti() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const [pacchetti, setPacchetti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [acquistoInCorso, setAcquistoInCorso] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/pacchetti')
      .then((res) => {
        if (!res.ok) throw new Error('Errore nel caricamento dei pacchetti');
        return res.json();
      })
      .then((data) => {
        setPacchetti(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  }, []);

  async function handleAcquista(pacchettoId) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pacchetti' } });
      return;
    }

    setErrore(null);
    setMessaggio(null);
    setAcquistoInCorso(pacchettoId);
    try {
      await apiFetch(`/api/pacchetti/${pacchettoId}/acquista`, token, { method: 'POST' });
      setMessaggio('Pacchetto acquistato! Lo trovi nella sezione "I miei abbonamenti".');
    } catch (err) {
      setErrore(err.message);
    } finally {
      setAcquistoInCorso(null);
    }
  }

  return (
    <Container style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>I Nostri Pacchetti</h1>
      <p style={{ textAlign: 'center', opacity: 0.75, marginBottom: '2rem' }}>
        Risparmia scegliendo un pacchetto di sessioni multiple
      </p>

      {errore && <Alert variant="danger" onClose={() => setErrore(null)} dismissible>{errore}</Alert>}
      {messaggio && <Alert variant="success" onClose={() => setMessaggio(null)} dismissible>{messaggio}</Alert>}

      {caricamento && (
        <div style={{ textAlign: 'center' }}>
          <Spinner animation="border" style={{ color: '#3B5D45' }} />
        </div>
      )}

      {!caricamento && !errore && (
        <Row className="gy-4 justify-content-center">
          {pacchetti.map((pacchetto) => (
            <Col md={6} lg={4} key={pacchetto.id}>
              <Card style={{ border: '1px solid #6B8F71', height: '100%' }}>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{pacchetto.nome}</Card.Title>
                  <Card.Text style={{ opacity: 0.8 }}>{pacchetto.descrizione}</Card.Text>

                  <ListGroup variant="flush" className="my-3">
                    {pacchetto.servizi.map((ps) => (
                      <ListGroup.Item
                        key={ps.servizioId}
                        style={{ backgroundColor: 'transparent', border: 'none', padding: '0.4rem 0' }}
                      >
                        <FaCheckCircle style={{ color: '#3B5D45', marginRight: '0.5rem' }} />
                        {ps.servizioNome}{' '}
                        <Badge style={{ backgroundColor: '#6B8F71' }}>x{ps.quantitaInclusa}</Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#3B5D45', marginBottom: '1rem' }}>
                      <FaEuroSign style={{ marginRight: '0.2rem' }} />
                      {pacchetto.prezzo}
                    </div>
                    <Button
                      style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45', width: '100%' }}
                      disabled={acquistoInCorso === pacchetto.id}
                      onClick={() => handleAcquista(pacchetto.id)}
                    >
                      {acquistoInCorso === pacchetto.id ? 'Acquisto in corso...' : 'Acquista'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Pacchetti;