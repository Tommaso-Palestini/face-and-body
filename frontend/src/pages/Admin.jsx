import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Tabs, Tab, Badge, Row, Col } from 'react-bootstrap';
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

function TabPacchetti({ token }) {
  const [pacchetti, setPacchetti] = useState([]);
  const [servizi, setServizi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pacchettoInModifica, setPacchettoInModifica] = useState(null);
  const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);

  const [nome, setNome] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [righeServizi, setRigheServizi] = useState([{ servizioId: '', quantitaInclusa: '' }]);

  function carica() {
    apiFetch('/api/pacchetti', token)
      .then((data) => { setPacchetti(data); setCaricamento(false); })
      .catch((err) => { setErrore(err.message); setCaricamento(false); });
  }
  useEffect(carica, [token]);

  useEffect(() => {
    apiFetch('/api/servizi', token).then(setServizi).catch(() => {});
  }, [token]);

  function apriCreazione() {
    setPacchettoInModifica(null);
    setNome('');
    setDescrizione('');
    setPrezzo('');
    setRigheServizi([{ servizioId: '', quantitaInclusa: '' }]);
    setShowModal(true);
  }

  function apriModifica(p) {
    setPacchettoInModifica(p);
    setNome(p.nome);
    setDescrizione(p.descrizione || '');
    setPrezzo(String(p.prezzo));
    setRigheServizi(
      p.servizi.length > 0
        ? p.servizi.map((s) => ({ servizioId: String(s.servizioId), quantitaInclusa: String(s.quantitaInclusa) }))
        : [{ servizioId: '', quantitaInclusa: '' }]
    );
    setShowModal(true);
  }

  function aggiungiRiga() {
    setRigheServizi([...righeServizi, { servizioId: '', quantitaInclusa: '' }]);
  }
  function rimuoviRiga(index) {
    setRigheServizi(righeServizi.filter((_, i) => i !== index));
  }
  function aggiornaRiga(index, campo, valore) {
    const nuove = [...righeServizi];
    nuove[index][campo] = valore;
    setRigheServizi(nuove);
  }

  async function handleSalva(e) {
    e.preventDefault();
    setErrore(null);
    setSalvataggioInCorso(true);
    try {
      const serviziValidi = righeServizi
        .filter((r) => r.servizioId && r.quantitaInclusa)
        .map((r) => ({ servizioId: Number(r.servizioId), quantitaInclusa: Number(r.quantitaInclusa) }));

      if (serviziValidi.length === 0) {
        throw new Error('Aggiungi almeno un servizio al pacchetto');
      }

      const body = JSON.stringify({ nome, descrizione, prezzo: Number(prezzo), servizi: serviziValidi });

      if (pacchettoInModifica) {
        await apiFetch(`/api/pacchetti/${pacchettoInModifica.id}`, token, { method: 'PUT', body });
        setMessaggio('Pacchetto aggiornato.');
      } else {
        await apiFetch('/api/pacchetti', token, { method: 'POST', body });
        setMessaggio('Pacchetto creato.');
      }
      setShowModal(false);
      carica();
    } catch (err) { setErrore(err.message); }
    finally { setSalvataggioInCorso(false); }
  }

  async function handleDisattiva(id) {
    if (!window.confirm('Eliminare/disattivare questo pacchetto?')) return;
    try {
      await apiFetch(`/api/pacchetti/${id}`, token, { method: 'DELETE' });
      setMessaggio('Pacchetto disattivato.');
      carica();
    } catch (err) { setErrore(err.message); }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Pacchetti</h4>
        <Button style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }} onClick={apriCreazione}>
          <FaPlus style={{ marginRight: '0.4rem' }} />Nuovo Pacchetto
        </Button>
      </div>
      {errore && <Alert variant="danger" onClose={() => setErrore(null)} dismissible>{errore}</Alert>}
      {messaggio && <Alert variant="success" onClose={() => setMessaggio(null)} dismissible>{messaggio}</Alert>}
      {!caricamento && (
        <Table responsive hover style={{ backgroundColor: '#EFE6D8' }}>
          <thead><tr><th>Nome</th><th>Prezzo</th><th>Servizi inclusi</th><th>Azioni</th></tr></thead>
          <tbody>
            {pacchetti.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>€{p.prezzo}</td>
                <td>{p.servizi.map((s) => `${s.servizioNome} x${s.quantitaInclusa}`).join(', ')}</td>
                <td>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => apriModifica(p)}><FaEdit /></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDisattiva(p.id)}><FaBan /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{pacchettoInModifica ? 'Modifica' : 'Nuovo'} Pacchetto</Modal.Title></Modal.Header>
        <Form onSubmit={handleSalva}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control value={nome} onChange={(e) => setNome(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control as="textarea" rows={2} value={descrizione} onChange={(e) => setDescrizione(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prezzo (€)</Form.Label>
              <Form.Control type="number" step="0.01" value={prezzo} onChange={(e) => setPrezzo(e.target.value)} required />
            </Form.Group>

            <Form.Label>Servizi inclusi</Form.Label>
            {righeServizi.map((riga, index) => (
              <Row key={index} className="mb-2 align-items-center">
                <Col md={6}>
                  <Form.Select
                    value={riga.servizioId}
                    onChange={(e) => aggiornaRiga(index, 'servizioId', e.target.value)}
                  >
                    <option value="">Seleziona servizio...</option>
                    {servizi.map((s) => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    placeholder="Quantità"
                    value={riga.quantitaInclusa}
                    onChange={(e) => aggiornaRiga(index, 'quantitaInclusa', e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  {righeServizi.length > 1 && (
                    <Button variant="outline-danger" size="sm" onClick={() => rimuoviRiga(index)}>
                      X
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={aggiungiRiga} className="mt-2">
              + Aggiungi servizio
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annulla</Button>
            <Button type="submit" disabled={salvataggioInCorso} style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }}>
              {salvataggioInCorso ? 'Salvataggio...' : 'Salva Pacchetto'}
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
  const [dataFiltro, setDataFiltro] = useState('');

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
      <div className="d-flex justify-content-between align-items-center mb-3 no-stampa">
        <h4>Tutti gli Appuntamenti</h4>
        <Button style={{ backgroundColor: '#3B5D45', borderColor: '#3B5D45' }} onClick={apriCreazione}>
          <FaPlus style={{ marginRight: '0.4rem' }} />Nuovo (per cliente)
        </Button>
      </div>

      <div className="no-stampa">
        {errore && <Alert variant="danger" onClose={() => setErrore(null)} dismissible>{errore}</Alert>}
        {messaggio && <Alert variant="success" onClose={() => setMessaggio(null)} dismissible>{messaggio}</Alert>}
      </div>

      <div className="d-flex align-items-center gap-2 mb-3 no-stampa">
        <Form.Control
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        {dataFiltro && (
          <>
            <Button variant="outline-secondary" size="sm" onClick={() => setDataFiltro('')}>
              Mostra tutti
            </Button>
            <Button variant="outline-primary" size="sm" onClick={() => window.print()}>
              Stampa
            </Button>
          </>
        )}
      </div>

      {!caricamento && (
        <div className="stampa-area">
          {dataFiltro && (() => {
            const appuntamentiGiorno = appuntamenti.filter((a) => a.dataOra.startsWith(dataFiltro));
            const completati = appuntamentiGiorno.filter((a) => a.stato === 'COMPLETATO');
            const clientiUnici = [...new Set(appuntamentiGiorno.map((a) => a.utenteNomeCompleto))];
            const trattamentiConteggio = {};
            appuntamentiGiorno.forEach((a) => {
              trattamentiConteggio[a.servizioNome] = (trattamentiConteggio[a.servizioNome] || 0) + 1;
            });

            return (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>
                  Agenda del {new Date(dataFiltro).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
                </h4>
                <p style={{ marginBottom: '0.3rem' }}>
                  <strong>{appuntamentiGiorno.length}</strong> appuntamenti totali —{' '}
                  <strong>{completati.length}</strong> completati —{' '}
                  <strong>{clientiUnici.length}</strong> clienti diversi
                </p>
                <p style={{ marginBottom: 0, fontSize: '0.9rem', opacity: 0.85 }}>
                  Trattamenti: {Object.entries(trattamentiConteggio).map(([nome, n]) => `${nome} (${n})`).join(', ') || 'nessuno'}
                </p>
              </div>
            );
          })()}

          <Table responsive hover style={{ backgroundColor: '#EFE6D8' }}>
            <thead>
              <tr>
                <th>Cliente</th><th>Servizio</th><th>Data/Ora</th><th>Operatrice</th><th>Cabina</th><th>Stato</th>
                <th className="no-stampa">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {appuntamenti
                .filter((a) => !dataFiltro || a.dataOra.startsWith(dataFiltro))
                .sort((a, b) => new Date(b.dataOra) - new Date(a.dataOra))
                .map((a) => (
                  <tr key={a.id}>
                    <td>{a.utenteNomeCompleto}</td>
                    <td>{a.servizioNome}</td>
                    <td>{new Date(a.dataOra).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{a.operatriceNome || '—'}</td>
                    <td>{a.cabinaNome || '—'}</td>
                    <td><Badge style={{ backgroundColor: badgeColore[a.stato] }}>{a.stato}</Badge></td>
                    <td className="no-stampa">
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
        </div>
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

function TabRecensioni({ token }) {
  const [recensioni, setRecensioni] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    apiFetch('/api/recensioni', token)
      .then((data) => { setRecensioni(data); setCaricamento(false); })
      .catch((err) => { setErrore(err.message); setCaricamento(false); });
  }, [token]);

  return (
    <div>
      <h4 className="mb-3">Recensioni Ricevute</h4>
      {errore && <Alert variant="danger">{errore}</Alert>}
      {!caricamento && (
        <Table responsive hover style={{ backgroundColor: '#EFE6D8' }}>
          <thead><tr><th>Cliente</th><th>Voto</th><th>Commento</th><th>Data</th></tr></thead>
          <tbody>
            {recensioni
              .sort((a, b) => new Date(b.creatoIl) - new Date(a.creatoIl))
              .map((r) => (
                <tr key={r.id}>
                  <td>{r.utenteNomeCompleto}</td>
                  <td>{'★'.repeat(r.voto)}{'☆'.repeat(5 - r.voto)}</td>
                  <td>{r.commento}</td>
                  <td>{new Date(r.creatoIl).toLocaleDateString('it-IT')}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

function Admin() {
  const { token } = useAuth();
  return (
    <Container style={{ padding: '3rem 1rem', minHeight: '70vh' }}>
      <h1 className="mb-4 no-stampa">Dashboard Admin</h1>
      <Tabs defaultActiveKey="servizi" className="mb-4 no-stampa">
        <Tab eventKey="servizi" title="Servizi">
          <TabServizi token={token} />
        </Tab>
        <Tab eventKey="pacchetti" title="Pacchetti">
          <TabPacchetti token={token} />
        </Tab>
        <Tab eventKey="appuntamenti" title="Appuntamenti">
          <TabAppuntamenti token={token} />
        </Tab>
        <Tab eventKey="recensioni" title="Recensioni">
          <TabRecensioni token={token} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Admin;