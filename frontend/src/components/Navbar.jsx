import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#F7F1E6' : '#EFE6D8',
  fontWeight: isActive ? 600 : 400,
  marginRight: '1.2rem',
});

function AppNavbar() {
  const navigate = useNavigate();

  return (
    <BsNavbar expand="lg" style={{ backgroundColor: '#24392A' }} variant="dark" sticky="top">
      <Container>
        <BsNavbar.Brand
          as={NavLink}
          to="/"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#F7F1E6' }}
        >
          <FaLeaf style={{ marginRight: '0.5rem', marginBottom: '4px' }} />
          Face and Body
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-navbar" />
        <BsNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" style={navLinkStyle} end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/servizi" style={navLinkStyle}>
              Servizi
            </Nav.Link>
            <Nav.Link as={NavLink} to="/pacchetti" style={navLinkStyle}>
              Pacchetti
            </Nav.Link>
            <Nav.Link as={NavLink} to="/chi-siamo" style={navLinkStyle}>
              Chi Siamo
            </Nav.Link>
            <Button
              variant="outline-light"
              className="me-2 mt-2 mt-lg-0"
              onClick={() => navigate('/login')}
            >
              Accedi
            </Button>
            <Button
              style={{ backgroundColor: '#6B8F71', borderColor: '#6B8F71' }}
              className="mt-2 mt-lg-0"
              onClick={() => navigate('/registrati')}
            >
              Prenota Ora
            </Button>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default AppNavbar;