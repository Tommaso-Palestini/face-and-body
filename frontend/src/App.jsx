import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servizi from './pages/Servizi';
import Pacchetti from './pages/Pacchetti';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servizi" element={<Servizi />} />
        <Route path="/pacchetti" element={<Pacchetti />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;