import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#F7F1E6' : '#EFE6D8',
  fontWeight: isActive ? 600 : 400,
  textShadow: isActive ? '0 0 10px rgba(247, 241, 230, 0.7)' : 'none',
  borderBottom: isActive ? '2px solid #F7F1E6' : '2px solid transparent',
  boxShadow: isActive ? '0 4px 10px -4px rgba(247, 241, 230, 0.6)' : 'none',
  paddingBottom: '4px',
  transition: 'all 0.25s ease',
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
          <div className="d-lg-flex w-100 align-items-center justify-content-between">
            <Nav className="d-lg-flex justify-content-lg-evenly flex-lg-grow-1 mx-lg-4">
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
            </Nav>
            <div className="d-flex align-items-center mt-3 mt-lg-0">
              <Button
                variant="outline-light"
                className="me-2"
                onClick={() => navigate('/login')}
              >
                Accedi
              </Button>
              <Button
                style={{ backgroundColor: '#6B8F71', borderColor: '#6B8F71' }}
                onClick={() => navigate('/registrati')}
              >
                Prenota Ora
              </Button>
            </div>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default AppNavbar;