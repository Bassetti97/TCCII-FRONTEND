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

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = () => {
    const { email, senha } = this.state;
    this.setState({ loading: true });

    // Enviando email e senha para o backend
    fetch(`https://lovely-solace-production.up.railway.app/auth/login`, { // Use a URL completa do seu backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    })
      .then((response) => {
        console.log('Resposta do servidor:', response);
        if (!response.ok) {
          throw new Error('Erro na resposta do servidor');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Dados recebidos:', data);
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.props.navigate('/agendamento');
          alert('Login realizado com sucesso');
        } else {
          this.setState({ error: 'Login falhou. Verifique suas credenciais.' });
        }
      })
      .catch((error) => {
        console.error('Erro ao fazer login:', error);
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

const LoginWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
};

export default LoginWithNavigate;
