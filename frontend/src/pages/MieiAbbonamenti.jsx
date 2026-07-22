import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { FaBoxOpen } from 'react-icons/fa';

function MieiAbbonamenti() {
  const { token } = useAuth();
  const [abbonamenti, setAbbonamenti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    apiFetch('/api/pacchetti/miei-abbonamenti', token)
      .then((data) => {
        setAbbonamenti(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  }, [token]);

  return (
    <Container style={{ padding: '4rem 1rem', minHeight: '65vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>I Miei Abbonamenti</h1>
      <p style={{ textAlign: 'center', opacity: 0.75, marginBottom: '3rem' }}>
        I pacchetti che hai acquistato e le sessioni residue
      </p>

      {caricamento && (
        <div style={{ textAlign: 'center' }}>
          <Spinner animation="border" style={{ color: '#3B5D45' }} />
        </div>
      )}

      {errore && <Alert variant="danger">{errore}</Alert>}

      {!caricamento && !errore && abbonamenti.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.7 }}>
          <FaBoxOpen size={40} style={{ marginBottom: '1rem' }} />
          <p>Non hai ancora acquistato nessun pacchetto.</p>
        </div>
      )}

      {!caricamento && !errore && abbonamenti.length > 0 && (
        <Row className="gy-4 justify-content-center">
          {abbonamenti.map((ab) => {
            const totale = ab.sessioniRimanenti + (ab.stato === 'ESAURITO' ? 0 : ab.sessioniRimanenti);
            const percentuale = ab.stato === 'ESAURITO' ? 100 : 0;
            return (
              <Col md={6} lg={4} key={ab.id}>
                <Card style={{ border: 'none', backgroundColor: '#EFE6D8', height: '100%' }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <Card.Title>{ab.pacchettoNome}</Card.Title>
                      <Badge
                        style={{
                          backgroundColor: ab.stato === 'ATTIVO' ? '#3B5D45' : ab.stato === 'ESAURITO' ? '#a94442' : '#888',
                        }}
                      >
                        {ab.stato}
                      </Badge>
                    </div>
                    <p style={{ opacity: 0.75, fontSize: '0.85rem' }}>
                      Acquistato il {new Date(ab.acquistatoIl).toLocaleDateString('it-IT')}
                    </p>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span style={{ fontSize: '0.9rem' }}>Sessioni rimanenti</span>
                        <strong>{ab.sessioniRimanenti}</strong>
                      </div>
                      <ProgressBar
                        now={ab.sessioniRimanenti > 0 ? 100 : 0}
                        style={{ height: '8px' }}
                        variant={ab.stato === 'ESAURITO' ? 'danger' : 'success'}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default MieiAbbonamenti;