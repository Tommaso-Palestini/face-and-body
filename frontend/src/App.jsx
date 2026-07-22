import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<div style={{ padding: '4rem', textAlign: 'center' }}>Home in arrivo</div>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;