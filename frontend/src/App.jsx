import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servizi from './pages/Servizi';
import Pacchetti from './pages/Pacchetti';
import ChiSiamo from './pages/ChiSiamo';
import Login from './pages/Login';
import Registrati from './pages/Registrati';
import Prenota from './pages/Prenota';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servizi" element={<Servizi />} />
        <Route path="/pacchetti" element={<Pacchetti />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrati" element={<Registrati />} />
        <Route path="/prenota" element={<Prenota />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;