
/** 
// Página de Contato
const Contact = () => {
    return (
      <div className="contact-container">
        <header>
          <nav>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/schedule">Agenda de Horários</Link></li>
              <li><Link to="/establishment">Estabelecimento</Link></li>
              <li><Link to="/register">Cadastro de Clientes</Link></li>
              <li><Link to="/contact">Fale Conosco</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <div className="contact-section">
            <h2>Fale Conosco</h2>
            <form>
              <label htmlFor="name">Nome:</label>
              <input type="text" id="name" name="name" required />
              <label htmlFor="email">E-mail:</label>
              <input type="email" id="email" name="email" required />
              <label htmlFor="message">Mensagem:</label>
              <textarea id="message" name="message" required></textarea>
              <button type="submit" className="submit-button">Enviar</button>
            </form>
          </div>
        </main>
        <footer>
          <p>&copy; 2023 Agendamento Eficiente. Todos os direitos reservados.</p>
        </footer>
      </div>
    );
  };
  */