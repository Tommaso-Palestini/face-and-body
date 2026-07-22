import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Registrati() {
  const { registra } = useAuth();
  const navigate = useNavigate();

  const [errore, setErrore] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const [mostraPassword, setMostraPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore(null);

    const formData = new FormData(e.target);
    const nome = formData.get('nome');
    const cognome = formData.get('cognome');
    const email = formData.get('email');
    const password = formData.get('password');
    const confermaPassword = formData.get('confermaPassword');

    if (!nome || !cognome || !email || !password || !confermaPassword) {
      setErrore('Compila tutti i campi');
      return;
    }
    if (password !== confermaPassword) {
      setErrore('Le password non coincidono');
      return;
    }
    if (password.length < 8) {
      setErrore('La password deve contenere almeno 8 caratteri');
      return;
    }

    setCaricamento(true);
    try {
      await registra(nome, cognome, email, password);
      navigate('/');
    } catch (err) {
      setErrore(err.message);
    } finally {
      setCaricamento(false);
    }
  }

  return (
    <Container style={{ padding: '4rem 1rem', minHeight: '65vh' }}>
      <Row className="justify-content-center">
        <Col md={7} lg={6}>
          <Card style={{ border: 'none', backgroundColor: '#EFE6D8', padding: '1rem' }}>
            <Card.Body>
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Crea il tuo account</h2>

              {errore && <Alert variant="danger">{errore}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control type="text" name="nome" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cognome</Form.Label>
                      <Form.Control type="text" name="cognome" required />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" required placeholder="nome@esempio.com" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type={mostraPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="Almeno 8 caratteri"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setMostraPassword(!mostraPassword)}
                      style={{ marginLeft: '0.5rem' }}
                      type="button"
                    >
                      {mostraPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Conferma Password</Form.Label>
                  <Form.Control
                    type={mostraPassword ? 'text' : 'password'}
                    name="confermaPassword"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" disabled={caricamento} style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }}>
                    {caricamento ? 'Creazione account...' : 'Registrati'}
                  </Button>
                </div>
              </Form>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0 }}>
                Hai già un account? <Link to="/login" style={{ color: '#3B5D45', fontWeight: 500 }}>Accedi</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Registrati;