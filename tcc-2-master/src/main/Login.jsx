import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      senha: '',
      error: null,
      loading: false,
    };
  }

  // Manipulador de input
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = () => {
    const { email, senha } = this.state; // Assumindo que você tem esses campos no estado
    this.setState({ loading: true }); // Inicia o carregamento

    // Enviando email e senha para o backend
    fetch('http://localhost:8080/auth/login', { // Use a URL completa do seu backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    })
      .then((response) => {
        console.log('Resposta do servidor:', response); // Log da resposta completa
        if (!response.ok) {
          throw new Error('Erro na resposta do servidor'); // Adiciona um erro se a resposta não for ok
        }
        return response.json();
      })
      .then((data) => {
        console.log('Dados recebidos:', data); // Log dos dados recebidos
        if (data.token) {
          // Salvando o token no localStorage
          localStorage.setItem('token', data.token);
          // Redirecionando para a página de agendamento
          this.props.navigate('/agendamento');
          alert('Login realizado com sucesso');
        } else {
          // Tratar erro de login
          this.setState({ error: 'Login falhou. Verifique suas credenciais.' });
        }
      })
      .catch((error) => {
        console.error('Erro ao fazer login:', error); // Log do erro
        this.setState({ error: 'Erro ao fazer login. Tente novamente.' });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { email, senha, error, loading } = this.state;

    return (
      <div className= 'login-container'>

        
        <h1>Login</h1>
        {error && <p className='login.error' style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); this.handleLogin(); }}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="senha"
            value={senha}
            onChange={this.handleInputChange}
            placeholder="Senha"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }
}

// Componente que envolve o Login para obter a função navigate
const LoginWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
};

export default LoginWithNavigate;
