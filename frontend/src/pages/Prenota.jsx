import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt } from 'react-icons/fa';

function Prenota() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    // Placeholder: qui arriverà il calendario vero
    return (
      <Container style={{ padding: '4rem 1rem', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Il calendario arriva presto</h2>
        <p style={{ opacity: 0.75 }}>Questa sezione sarà completata a breve.</p>
      </Container>
    );
  }

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

export default Prenota;