import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [errore, setErrore] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const [mostraPassword, setMostraPassword] = useState(false);

  const destinazione = location.state?.from || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore(null);
    setCaricamento(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await login(email, password);
      navigate(destinazione);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setCaricamento(false);
    }
  }

  return (
    <Container style={{ padding: '4rem 1rem', minHeight: '65vh' }}>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card style={{ border: 'none', backgroundColor: '#EFE6D8', padding: '1rem' }}>
            <Card.Body>
              <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Accedi</h2>

              {errore && <Alert variant="danger">{errore}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" required placeholder="nome@esempio.com" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type={mostraPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="La tua password"
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

                <div className="d-grid">
                  <Button type="submit" disabled={caricamento} style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }}>
                    {caricamento ? 'Accesso in corso...' : 'Accedi'}
                  </Button>
                </div>
              </Form>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0 }}>
                Non hai un account? <Link to="/registrati" style={{ color: '#3B5D45', fontWeight: 500 }}>Registrati ora</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;