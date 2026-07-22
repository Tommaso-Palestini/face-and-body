import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servizi from './pages/Servizi';
import Pacchetti from './pages/Pacchetti';
import ChiSiamo from './pages/ChiSiamo';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servizi" element={<Servizi />} />
        <Route path="/pacchetti" element={<Pacchetti />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;