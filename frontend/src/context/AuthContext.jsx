import { createContext, useContext, useState } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [utente, setUtente] = useState(() => {
    const salvato = localStorage.getItem('utente');
    return salvato ? JSON.parse(salvato) : null;
  });

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Email o password non corretti');
    }

    const data = await res.json();
    const utenteLoggato = { email: data.email, nome: data.nome, ruolo: data.ruolo };

    setToken(data.token);
    setUtente(utenteLoggato);
    localStorage.setItem('token', data.token);
    localStorage.setItem('utente', JSON.stringify(utenteLoggato));

    return utenteLoggato;
  }

  async function registra(nome, cognome, email, password) {
    const res = await fetch(`${API_BASE}/api/auth/registrazione`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cognome, email, password }),
    });

    if (!res.ok) {
      const errore = await res.json().catch(() => null);
      throw new Error(errore?.message || 'Errore durante la registrazione');
    }

    // La registrazione non restituisce un token: facciamo login subito dopo
    return login(email, password);
  }

  function logout() {
    setToken(null);
    setUtente(null);
    localStorage.removeItem('token');
    localStorage.removeItem('utente');
  }

  const value = {
    token,
    utente,
    isAuthenticated: !!token,
    isAdmin: utente?.ruolo === 'ADMIN',
    login,
    registra,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}