import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { FaEdit, FaBan, FaPlus, FaCheck } from 'react-icons/fa';

function TabServizi({ token }) {
  const [servizi, setServizi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [servizioInModifica, setServizioInModifica] = useState(null);
  const [form, setForm] = useState({ nome: '', descrizione: '', prezzo: '', durataMuniti: '' });
  const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);

  function caricaServizi() {
    apiFetch('/api/servizi/admin/tutti', token)
      .then((data) => { setServizi(data); setCaricamento(false); })
      .catch((err) => { setErrore(err.message); setCaricamento(false); });
  }
  useEffect(caricaServizi, [token]);

  function apriCreazione() {
    setServizioInModifica(null);
    setForm({ nome: '', descrizione: '', prezzo: '', durataMuniti: '' });
    setShowModal(true);
  }
  function apriModifica(s) {
    setServizioInModifica(s);
    setForm({ nome: s.nome, descrizione: s.descrizione || '', prezzo: s.prezzo, durataMuniti: s.durataMuniti });
    setShowModal(true);
  }

  async function handleSalva(e) {
    e.preventDefault();
    setErrore(null);
    setSalvataggioInCorso(true);
    const body = JSON.stringify({
      nome: form.nome, descrizione: form.descrizione,
      prezzo: Number(form.prezzo), durataMuniti: Number(form.durataMuniti),
    });
    try {
      if (servizioInModifica) {
        await apiFetch(`/api/servizi/${servizioInModifica.id}`, token, { method: 'PUT', body });
        setMessaggio('Servizio aggiornato.');
      } else {
        await apiFetch('/api/servizi', token, { method: 'POST', body });
        setMessaggio('Servizio creato.');
      }
      setShowModal(false);
      caricaServizi();
    } catch (err) { setErrore(err.message); }
    finally { setSalvataggioInCorso(false); }
  }

  async function handleDisattiva(id) {
    if (!window.confirm('Disattivare questo servizio?')) return;
    try {
      await apiFetch(`/api/servizi/${id}`, token, { method: 'DELETE' });
      setMessaggio('Servizio disattivato.');
      caricaServizi();
    } catch (err) { setErrore(err.message); }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Servizi</h4>
        <Button style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }} onClick={apriCreazione}>
          <FaPlus style={{ marginRight: '0.4rem' }} />Nuovo Servizio
        </Button>
      </div>
      {errore && <Alert variant="danger" onClose={() => setErrore(null)} dismissible>{errore}</Alert>}
      {messaggio && <Alert variant="success" onClose={() => setMessaggio(null)} dismissible>{messaggio}</Alert>}
      {!caricamento && (
        <Table responsive hover style={{ backgroundColor: '#EFE6D8' }}>
          <thead><tr><th>Nome</th><th>Prezzo</th><th>Durata</th><th>Stato</th><th>Azioni</th></tr></thead>
          <tbody>
            {servizi.map((s) => (
              <tr key={s.id} style={{ opacity: s.disponibile ? 1 : 0.5 }}>
                <td>{s.nome}</td><td>€{s.prezzo}</td><td>{s.durataMuniti} min</td>
                <td>{s.disponibile ? 'Disponibile' : 'Disattivato'}</td>
                <td>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => apriModifica(s)}><FaEdit /></Button>
                  {s.disponibile && <Button variant="outline-danger" size="sm" onClick={() => handleDisattiva(s.id)}><FaBan /></Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{servizioInModifica ? 'Modifica' : 'Nuovo'} Servizio</Modal.Title></Modal.Header>
        <Form onSubmit={handleSalva}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.descrizione} onChange={(e) => setForm({ ...form, descrizione: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prezzo (€)</Form.Label>
              <Form.Control type="number" step="0.01" value={form.prezzo} onChange={(e) => setForm({ ...form, prezzo: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Durata (minuti)</Form.Label>
              <Form.Control type="number" value={form.durataMuniti} onChange={(e) => setForm({ ...form, durataMuniti: e.target.value })} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annulla</Button>
            <Button type="submit" disabled={salvataggioInCorso} style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }}>
              {salvataggioInCorso ? 'Salvataggio...' : 'Salva'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

function TabAppuntamenti({ token }) {
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [utenti, setUtenti] = useState([]);
  const [servizi, setServizi] = useState([]);
  const [operatrici, setOperatrici] = useState([]);
  const [cabine, setCabine] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);

  const [form, setForm] = useState({
    utenteId: '', servizioId: '', data: '', ora: '', operatriceId: '', cabinaId: '',
  });

  function carica() {
    apiFetch('/api/appuntamenti/admin/tutti', token)
      .then((data) => { setAppuntamenti(data); setCaricamento(false); })
      .catch((err) => { setErrore(err.message); setCaricamento(false); });
  }
  useEffect(carica, [token]);

  useEffect(() => {
    apiFetch('/api/utenti', token).then(setUtenti).catch(() => {});
    apiFetch('/api/servizi', token).then(setServizi).catch(() => {});
    apiFetch('/api/appuntamenti/operatrici', token).then(setOperatrici).catch(() => {});
    apiFetch('/api/appuntamenti/cabine', token).then(setCabine).catch(() => {});
  }, [token]);

  async function handleCompleta(id) {
    try {
      await apiFetch(`/api/appuntamenti/${id}/completa`, token, { method: 'PATCH' });
      setMessaggio('Appuntamento segnato come completato.');
      carica();
    } catch (err) { setErrore(err.message); }
  }

  function apriCreazione() {
    setForm({ utenteId: '', servizioId: '', data: '', ora: '09:00', operatriceId: '', cabinaId: '' });
    setShowModal(true);
  }

  async function handleSalva(e) {
    e.preventDefault();
    setErrore(null);
    setSalvataggioInCorso(true);
    try {
      const dataOra = `${form.data}T${form.ora}:00`;
      await apiFetch(`/api/appuntamenti/admin/prenota/${form.utenteId}`, token, {
        method: 'POST',
        body: JSON.stringify({
          servizioId: Number(form.servizioId),
          dataOra,
          operatriceId: form.operatriceId ? Number(form.operatriceId) : null,
          cabinaId: form.cabinaId ? Number(form.cabinaId) : null,
        }),
      });
      setMessaggio('Appuntamento creato per il cliente.');
      setShowModal(false);
      carica();
    } catch (err) { setErrore(err.message); }
    finally { setSalvataggioInCorso(false); }
  }

  const badgeColore = { CONFERMATO: '#3B5D45', COMPLETATO: '#6B8F71', CANCELLATO: '#a94442' };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Tutti gli Appuntamenti</h4>
        <Button style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }} onClick={apriCreazione}>
          <FaPlus style={{ marginRight: '0.4rem' }} />Nuovo (per cliente)
        </Button>
      </div>

      {errore && <Alert variant="danger" onClose={() => setErrore(null)} dismissible>{errore}</Alert>}
      {messaggio && <Alert variant="success" onClose={() => setMessaggio(null)} dismissible>{messaggio}</Alert>}

      {!caricamento && (
        <Table responsive hover style={{ backgroundColor: '#EFE6D8' }}>
          <thead><tr><th>Cliente</th><th>Servizio</th><th>Data/Ora</th><th>Operatrice</th><th>Cabina</th><th>Stato</th><th>Azioni</th></tr></thead>
          <tbody>
            {appuntamenti
              .sort((a, b) => new Date(b.dataOra) - new Date(a.dataOra))
              .map((a) => (
                <tr key={a.id}>
                  <td>{a.utenteNomeCompleto}</td>
                  <td>{a.servizioNome}</td>
                  <td>{new Date(a.dataOra).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{a.operatriceNome || '—'}</td>
                  <td>{a.cabinaNome || '—'}</td>
                  <td><Badge style={{ backgroundColor: badgeColore[a.stato] }}>{a.stato}</Badge></td>
                  <td>
                    {a.stato === 'CONFERMATO' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleCompleta(a.id)}>
                        <FaCheck style={{ marginRight: '0.3rem' }} />Completa
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Nuovo Appuntamento per un Cliente</Modal.Title></Modal.Header>
        <Form onSubmit={handleSalva}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select value={form.utenteId} onChange={(e) => setForm({ ...form, utenteId: e.target.value })} required>
                <option value="">Seleziona...</option>
                {utenti.filter((u) => u.ruolo === 'CLIENTE').map((u) => (
                  <option key={u.id} value={u.id}>{u.nome} {u.cognome} — {u.email}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Servizio</Form.Label>
              <Form.Select value={form.servizioId} onChange={(e) => setForm({ ...form, servizioId: e.target.value })} required>
                <option value="">Seleziona...</option>
                {servizi.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data</Form.Label>
                  <Form.Control type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ora</Form.Label>
                  <Form.Control type="time" value={form.ora} onChange={(e) => setForm({ ...form, ora: e.target.value })} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Operatrice</Form.Label>
                  <Form.Select value={form.operatriceId} onChange={(e) => setForm({ ...form, operatriceId: e.target.value })}>
                    <option value="">Nessuna</option>
                    {operatrici.map((o) => (
                      <option key={o.id} value={o.id}>{o.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cabina</Form.Label>
                  <Form.Select value={form.cabinaId} onChange={(e) => setForm({ ...form, cabinaId: e.target.value })}>
                    <option value="">Nessuna</option>
                    {cabine.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annulla</Button>
            <Button type="submit" disabled={salvataggioInCorso} style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }}>
              {salvataggioInCorso ? 'Salvataggio...' : 'Crea Appuntamento'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

function Admin() {
  const { token } = useAuth();
  return (
    <Container style={{ padding: '3rem 1rem', minHeight: '70vh' }}>
      <h1 className="mb-4">Dashboard Admin</h1>
      <Tabs defaultActiveKey="servizi" className="mb-4">
        <Tab eventKey="servizi" title="Servizi">
          <TabServizi token={token} />
        </Tab>
        <Tab eventKey="appuntamenti" title="Appuntamenti">
          <TabAppuntamenti token={token} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Admin;