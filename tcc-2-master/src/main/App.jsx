import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login'; 
import Cliente from './Cliente'; 
import Agendamento from './Agendamento'; 
import Estabelecimento from './Estabelecimento';



// Componente Home
const Home = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="home-container">
      <header>
        <nav>
          <div className="menu-icon" onClick={toggleMenu}>
            &#x22EE; {/* Ícone de três pontinhos */}
            
          </div>
          <span className="logo-name">BeautyBooker</span> {/* Nome da plataforma */}
          {showMenu && (
            <ul className="dropdown-menu">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/agendamento">Agendamento</Link></li>
              <li><Link to="/estabelecimento">Estabelecimento</Link></li>
              <li><Link to="/cliente">Cadastro de Clientes</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          )}
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
