import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaClock, FaEuroSign } from 'react-icons/fa';

function Servizi() {
  const [servizi, setServizi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/servizi')
      .then((res) => {
        if (!res.ok) throw new Error('Errore nel caricamento dei servizi');
        return res.json();
      })
      .then((data) => {
        setServizi(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  }, []);

  return (
    <Container style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>I Nostri Servizi</h1>
      <p style={{ textAlign: 'center', opacity: 0.75, marginBottom: '3rem' }}>
        Scopri tutti i trattamenti disponibili presso il nostro centro
      </p>

      {caricamento && (
        <div style={{ textAlign: 'center' }}>
          <Spinner animation="border" style={{ color: '#3B5D45' }} />
        </div>
      )}

      {errore && <Alert variant="danger">{errore}</Alert>}

      {!caricamento && !errore && (
        <Row className="gy-4">
          {servizi.map((servizio) => (
            <Col md={6} lg={4} key={servizio.id}>
              <Card style={{ border: 'none', backgroundColor: '#EFE6D8', height: '100%' }}>
                <Card.Body>
                  <Card.Title>{servizio.nome}</Card.Title>
                  <Card.Text style={{ opacity: 0.8, minHeight: '48px' }}>
                    {servizio.descrizione}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Badge style={{ backgroundColor: '#3B5D45' }}>
                      <FaClock style={{ marginRight: '0.3rem' }} />
                      {servizio.durataMuniti} min
                    </Badge>
                    <span style={{ fontWeight: 600, color: '#3B5D45', fontSize: '1.1rem' }}>
                      <FaEuroSign style={{ marginRight: '0.2rem' }} />
                      {servizio.prezzo}
                    </span>
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

export default Servizi;