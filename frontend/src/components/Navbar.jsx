import { Navbar as BsNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaLeaf, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

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
    const { isAuthenticated, isAdmin, utente, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <BsNavbar expand="lg" style={{ backgroundColor: '#24392A' }} variant="dark" sticky="top">
            <Container className="d-flex align-items-center flex-wrap">
                <BsNavbar.Brand
                    as={NavLink}
                    to="/"
                    style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#F7F1E6' }}
                >
                    <FaLeaf style={{ marginRight: '0.5rem', marginBottom: '4px' }} />
                    Face and Body
                </BsNavbar.Brand>

                {/* Zona sempre visibile: utente/accedi + prenota + toggle hamburger */}
                <div className="d-flex align-items-center order-lg-3 ms-auto">
                    {isAuthenticated ? (
                        <NavDropdown
                            title={
                                <span style={{ color: '#F7F1E6' }}>
                                    <FaUserCircle style={{ marginRight: '0.4rem', marginBottom: '2px' }} />
                                    {utente.nome}
                                </span>
                            }
                            align="end"
                            className="me-2"
                        >
                            <NavDropdown.Item onClick={() => navigate('/prenota')}>
                                I miei appuntamenti
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/miei-abbonamenti')}>
                                I miei abbonamenti
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/mie-recensioni')}>
                                Le mie recensioni
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Esci</NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                        <Button variant="outline-light" className="me-2" onClick={() => navigate('/login')}>
                            Accedi
                        </Button>
                    )}

                    <Button
                        style={{ backgroundColor: '#6B8F71', borderColor: '#6B8F71' }}
                        className="me-2"
                        onClick={() => navigate('/prenota')}
                    >
                        Prenota
                    </Button>

                    <BsNavbar.Toggle aria-controls="main-navbar" />
                </div>

                {/* Zona collassabile: solo i link di navigazione */}
                <BsNavbar.Collapse id="main-navbar" className="order-lg-2 flex-grow-1 mt-3 mt-lg-0">
                    <Nav className="d-lg-flex justify-content-lg-evenly w-100 mx-lg-4">
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
                        {isAdmin && (
                            <Nav.Link as={NavLink} to="/admin" style={navLinkStyle}>
                                Dashboard
                            </Nav.Link>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
}

export default AppNavbar;