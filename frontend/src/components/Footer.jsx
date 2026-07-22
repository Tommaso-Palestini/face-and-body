import { Container, Row, Col } from 'react-bootstrap';
import { FaLeaf, FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#24392A', color: '#EFE6D8', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h5 style={{ color: '#F7F1E6', fontFamily: 'Playfair Display, serif' }}>
              <FaLeaf style={{ marginRight: '0.5rem' }} />
              Face and Body
            </h5>
            <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>
              Il tuo centro estetico di fiducia. Bellezza e benessere in un ambiente elegante e rilassante.
            </p>
          </Col>
          <Col md={4}>
            <h6 style={{ color: '#F7F1E6' }}>Contatti</h6>
            <p style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '0.4rem' }}>
              <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
              Via delle Rose 12, Torino
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '0.4rem' }}>
              <FaPhone style={{ marginRight: '0.5rem' }} />
              +39 011 1234567
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>
              <FaEnvelope style={{ marginRight: '0.5rem' }} />
              info@faceandbody.it
            </p>
          </Col>
          <Col md={4}>
            <h6 style={{ color: '#F7F1E6' }}>Seguici</h6>
            <div style={{ fontSize: '1.3rem' }}>
              <a href="https://www.instagram.com/_faceandbody_/" style={{ color: '#EFE6D8', marginRight: '1rem' }}>
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/faceandbody2/?locale=it_IT" style={{ color: '#EFE6D8' }}>
                <FaFacebookF />
              </a>
            </div>
          </Col>
        </Row>
        <hr style={{ borderColor: '#6B8F71', opacity: 0.3, marginTop: '2rem' }} />
        <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.7, marginBottom: 0 }}>
          © 2026 Face and Body. Tutti i diritti riservati.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;