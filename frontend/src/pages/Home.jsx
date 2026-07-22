import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSpa, FaHeart, FaCalendarCheck } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(rgba(36,57,42,0.75), rgba(36,57,42,0.75))',
          padding: '6rem 0',
          textAlign: 'center',
          color: '#F7F1E6',
        }}
      >
        <Container>
          <h1 style={{ color: '#F7F1E6', fontSize: '3rem', marginBottom: '1rem' }}>
            Prenditi cura di te
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Trattamenti di bellezza e benessere in un'atmosfera elegante e rilassante.
            Il tuo momento di relax inizia qui.
          </p>
          <Button
            size="lg"
            style={{ backgroundColor: '#6B8F71', borderColor: '#6B8F71', padding: '0.7rem 2rem' }}
            onClick={() => navigate('/registrati')}
          >
            Prenota il tuo trattamento
          </Button>
        </Container>
      </div>

      {/* Punti di forza */}
      <Container style={{ padding: '4rem 1rem' }}>
        <Row className="text-center gy-4">
          <Col md={4}>
            <FaSpa size={40} style={{ color: '#3B5D45', marginBottom: '1rem' }} />
            <h4>Trattamenti Professionali</h4>
            <p style={{ opacity: 0.8 }}>
              Personale qualificato ed esperienza pluriennale nel settore beauty.
            </p>
          </Col>
          <Col md={4}>
            <FaHeart size={40} style={{ color: '#3B5D45', marginBottom: '1rem' }} />
            <h4>Ambiente Curato</h4>
            <p style={{ opacity: 0.8 }}>
              Un'atmosfera elegante pensata per il tuo massimo relax.
            </p>
          </Col>
          <Col md={4}>
            <FaCalendarCheck size={40} style={{ color: '#3B5D45', marginBottom: '1rem' }} />
            <h4>Prenotazione Facile</h4>
            <p style={{ opacity: 0.8 }}>
              Prenota online in pochi click, scegli data e orario che preferisci.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Anteprima servizi */}
      <div style={{ backgroundColor: '#EFE6D8', padding: '4rem 0' }}>
        <Container>
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>I Nostri Servizi</h2>
          <Row className="gy-4">
            <Col md={4}>
              <Card style={{ border: 'none', backgroundColor: '#F7F1E6' }}>
                <Card.Body className="text-center">
                  <Card.Title>Manicure & Pedicure</Card.Title>
                  <Card.Text style={{ opacity: 0.8 }}>
                    Cura delle mani e dei piedi con trattamenti su misura.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={{ border: 'none', backgroundColor: '#F7F1E6' }}>
                <Card.Body className="text-center">
                  <Card.Title>Massaggi</Card.Title>
                  <Card.Text style={{ opacity: 0.8 }}>
                    Massaggi rilassanti e anti-stress per il tuo benessere.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={{ border: 'none', backgroundColor: '#F7F1E6' }}>
                <Card.Body className="text-center">
                  <Card.Title>Trattamenti Viso</Card.Title>
                  <Card.Text style={{ opacity: 0.8 }}>
                    Pulizia e idratazione profonda per una pelle radiosa.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Button
              variant="outline-primary"
              onClick={() => navigate('/servizi')}
            >
              Scopri tutti i servizi
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Home;