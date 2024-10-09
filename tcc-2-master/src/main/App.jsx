import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login'; 
import Cliente from './Cliente'; 
import Agendamento from './Agendamento'; 
import Estabelecimento from './Estabelecimento';

// Componente com Imagem (removido)
const ImageComponent = () => {
  return (
    <div className="image-container">
      {/* Imagem removida */}
    </div>
  );
};

// Componente Home
const Home = () => {
  return (
    <div className="home-container">
      <header>
        <nav>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/agendamento">Agendamento</Link></li>
            <li><Link to="/estabelecimento">Estabelecimento</Link></li>
            <li><Link to="/cliente">Cadastro de Clientes</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <div className="container">
          <h1 className="home-h1">BeautyBooker</h1>
          <p>A plataforma de agendamentos, onde a eficiência encontra a simplicidade para otimizar seu tempo.</p>
          <Link to="/login" className="login-button">LOGIN</Link>
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Agendamento Eficiente. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* Página de Login */}
        <Route path="/cliente" element={<Cliente />} /> {/* Página de Cliente */}
        <Route path="/agendamento" element={<Agendamento />} /> {/* Página de Agendamento */}
        <Route path="/estabelecimento" element={<Estabelecimento />} /> {/* Página de Estabelecimento */}
      
      </Routes>
    </Router>
  );
};

export default App;
