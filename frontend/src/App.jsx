import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servizi from './pages/Servizi';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servizi" element={<Servizi />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;