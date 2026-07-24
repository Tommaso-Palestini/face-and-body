import { Container, Row, Col, Table } from 'react-bootstrap';
import { FaSpa, FaUsers, FaAward, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const orari = [
  { giorno: 'Lunedì', orario: 'Chiuso' },
  { giorno: 'Martedì', orario: '09:30 - 18:30' },
  { giorno: 'Mercoledì', orario: '09:00 - 18:30' },
  { giorno: 'Giovedì', orario: '09:30 - 18:30' },
  { giorno: 'Venerdì', orario: '09:00 - 18:30' },
  { giorno: 'Sabato', orario: '09:00 - 13:00' },
  { giorno: 'Domenica', orario: 'Chiuso' },
];

function ChiSiamo() {
  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(rgba(36,57,42,0.75), rgba(36,57,42,0.75))',
          padding: '5rem 0',
          textAlign: 'center',
          color: '#F7F1E6',
        }}
      >
        <Container>
          <h1 style={{ color: '#F7F1E6' }}>Chi Siamo</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            Pelle curata e mente leggera
          </p>
        </Container>
      </div>

      <Container style={{ padding: '4rem 1rem' }}>
        <Row className="align-items-center gy-4">
          <Col md={6}>
            <h2>La Nostra Storia</h2>
            <p style={{ opacity: 0.85, lineHeight: 1.7 }}>
              Face and Body è il centro estetico di fiducia a Viareggio, dove ogni trattamento
              nasce dall'ascolto delle esigenze di chi abbiamo davanti. Ci prendiamo cura della
              pelle e del corpo con la stessa attenzione con cui ci prendiamo cura del benessere
              generale, in un ambiente elegante, curato e accogliente.
            </p>
            <p style={{ opacity: 0.85, lineHeight: 1.7 }}>
              Siamo specializzate in trattamenti mirati e percorsi di benessere su misura,
              pensati per lasciarti non solo con una pelle curata, ma anche con la mente più
              leggera.
            </p>
          </Col>
          <Col md={6}>
            <img
              src="/fotoFAB.jpg"
              alt="Face and Body - Centro Estetico"
              style={{
                width: '100%',
                borderRadius: '12px',
                objectFit: 'contain',
                maxHeight: '400px',
                backgroundColor: '#EFE6D8',
              }}
            />
          </Col>
        </Row>

        <Row className="text-center gy-4 mt-5">
          <Col md={4}>
            <FaUsers size={36} style={{ color: '#3B5D45', marginBottom: '1rem' }} />
            <h4>Team Qualificato</h4>
            <p style={{ opacity: 0.8 }}>
              Professioniste esperte e sempre aggiornate, al tuo servizio.
            </p>
          </Col>
          <Col md={4}>
            <FaSpa size={36} style={{ color: '#3B5D45', marginBottom: '1rem' }} />
            <h4>Ambiente Elegante</h4>
            <p style={{ opacity: 0.8 }}>
              Uno spazio curato nei minimi dettagli, pensato per il tuo relax.
            </p>
          </Col>
          <Col md={4}>
            <FaAward size={36} style={{ color: '#3B5D45', marginBottom: '1rem' }} />
            <h4>Trattamenti su Misura</h4>
            <p style={{ opacity: 0.8 }}>
              Percorsi di benessere personalizzati in base alle tue esigenze.
            </p>
          </Col>
        </Row>

        {/* Dove siamo + Orari */}
        <Row className="gy-4 mt-5">
          <Col md={6}>
            <h3 style={{ marginBottom: '1.2rem' }}>
              <FaMapMarkerAlt style={{ color: '#3B5D45', marginRight: '0.5rem' }} />
              Dove Siamo
            </h3>
            <p style={{ opacity: 0.85 }}>Via Amerigo Vespucci 167, Viareggio (LU)</p>
            <p style={{ opacity: 0.85 }}>Tel: 329 802 0391</p>
            <p style={{ opacity: 0.85 }}>Email: faceandbody@alice.it</p>
          </Col>
          <Col md={6}>
            <h3 style={{ marginBottom: '1.2rem' }}>
              <FaClock style={{ color: '#3B5D45', marginRight: '0.5rem' }} />
              Orari di Apertura
            </h3>
            <Table style={{ backgroundColor: '#EFE6D8' }} borderless>
              <tbody>
                {orari.map((riga) => (
                  <tr key={riga.giorno}>
                    <td style={{ fontWeight: 500 }}>{riga.giorno}</td>
                    <td style={{ opacity: riga.orario === 'Chiuso' ? 0.6 : 1 }}>{riga.orario}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ChiSiamo;