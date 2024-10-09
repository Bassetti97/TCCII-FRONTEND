import React, { Component } from 'react';
import ClientSearch from './ClientSearch';
import './App.css';
import { Link } from 'react-router-dom';

class Cliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientes: [],
      searchValue: '',
      filteredClientes: [],
      nome: '',
      cpf: '',
      dataNascimento: '',
      logradouro: '',
      complemento: '',
      cep: '',
      telefone: '',
      email: '',
      editId: null,
      loading: true,
      error: null,
      showMenu: false, // Adicionado para controlar o menu
    };
  }

  token = localStorage.getItem('token');

  componentDidMount() {
    this.fetchClientes();
  }

  toggleMenu = () => {
    this.setState(prevState => ({ showMenu: !prevState.showMenu }));
  };

  // Função para buscar clientes (GET)
  fetchClientes = () => {
    fetch('http://localhost:8080/api/clientes', {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar clientes.');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ clientes: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  // Função para adicionar cliente (POST)
  addCliente = () => {
    const { nome, cpf } = this.state;
    if (nome && cpf) {
      fetch('http://localhost:8080/api/clientes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao adicionar cliente.');
          }
          return response.json();
        })
        .then((newCliente) => {
          this.setState((prevState) => ({
            clientes: [...prevState.clientes, newCliente],
            nome: '',
            cpf: '',
            dataNascimento: '',
            logradouro: '',
            complemento: '',
            cep: '',
            telefone: '',
            email: '',
            editId: null,
          }));
        })
        .catch((error) => {
          console.error('Erro ao adicionar cliente:', error);
        });
    } else {
      alert('Nome e CPF são obrigatórios.');
    }
  };

  // Função para atualizar cliente (PUT)
  updateCliente = (id) => {
    const { nome, cpf } = this.state;
    if (nome && cpf) {
      fetch(`http://localhost:8080/api/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao atualizar cliente.');
          }
          return response.json();
        })
        .then((updatedCliente) => {
          this.setState((prevState) => ({
            clientes: prevState.clientes.map((cliente) =>
              cliente.id === id ? updatedCliente : cliente
            ),
            nome: '',
            cpf: '',
            dataNascimento: '',
            logradouro: '',
            complemento: '',
            cep: '',
            telefone: '',
            email: '',
            editId: null,
          }));
        })
        .catch((error) => {
          console.error('Erro ao atualizar cliente:', error);
        });
    } else {
      alert('Nome e CPF são obrigatórios.');
    }
  };

  // Função para deletar cliente (DELETE)
  deleteCliente = (id) => {
    fetch(`http://localhost:8080/api/clientes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao remover cliente.');
        }
        this.setState((prevState) => ({
          clientes: prevState.clientes.filter((cliente) => cliente.id !== id),
        }));
      })
      .catch((error) => {
        console.error('Erro ao remover cliente:', error);
      });
  };

  // Função de submit para adicionar ou atualizar
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.editId) {
      this.updateCliente(this.state.editId);
    } else {
      this.addCliente();
    }
  };

  // Função para editar um cliente existente
  handleEdit = (cliente) => {
    this.setState({
      nome: cliente.nome,
      cpf: cliente.cpf,
      dataNascimento: cliente.dataNascimento,
      logradouro: cliente.logradouro,
      complemento: cliente.complemento,
      cep: cliente.cep,
      telefone: cliente.telefone,
      email: cliente.email,
      editId: cliente.id,
    });
  };

  // Função para buscar clientes por nome
  handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    this.setState({ searchValue });
  };

  render() {
    const { loading, error, clientes, searchValue, showMenu } = this.state;
    const filteredClientes = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(searchValue)
    );

    if (loading) {
      return <p className="cliente-loading">Carregando...</p>;
    }

    if (error) {
      return <p className="cliente-error">Erro: {error}</p>;
    }

    return (
      <div className='agendamento-home-container'>
        <header>
          <nav>
            <div className="menu-icon" onClick={this.toggleMenu}>
              &#x22EE; {/* Ícone de três pontinhos */}
            </div>
            <h1 className="home-h1">BeautyBooker</h1>
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

        <div className="cliente-container">
          <h1 className="cliente-title">Cadastro de Clientes</h1>

          <ClientSearch onClientSelect={this.handleEdit} />

          <form className="cliente-form" onSubmit={this.handleSubmit}>
            <input
              type="text"
              className="cliente-input"
              name="nome"
              value={this.state.nome}
              onChange={(e) => this.setState({ nome: e.target.value })}
              placeholder="Nome"
            />
            <input
              type="text"
              className="cliente-input"
              name="cpf"
              value={this.state.cpf}
              onChange={(e) => this.setState({ cpf: e.target.value })}
              placeholder="CPF"
            />
            <input
              type="date"
              className="cliente-input"
              name="dataNascimento"
              value={this.state.dataNascimento}
              onChange={(e) => this.setState({ dataNascimento: e.target.value })}
              placeholder="Data de Nascimento"
            />
            <input
              type="text"
              className="cliente-input"
              name="logradouro"
              value={this.state.logradouro}
              onChange={(e) => this.setState({ logradouro: e.target.value })}
              placeholder="Logradouro"
            />
            <input
              type="text"
              className="cliente-input"
              name="complemento"
              value={this.state.complemento}
              onChange={(e) => this.setState({ complemento: e.target.value })}
              placeholder="Complemento"
            />
            <input
              type="text"
              className="cliente-input"
              name="cep"
              value={this.state.cep}
              onChange={(e) => this.setState({ cep: e.target.value })}
              placeholder="CEP"
            />
            <input
              type="text"
              className="cliente-input"
              name="telefone"
              value={this.state.telefone}
              onChange={(e) => this.setState({ telefone: e.target.value })}
              placeholder="Telefone"
            />
            <input
              type="email"
              className="cliente-input"
              name="email"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
              placeholder="Email"
            />
            <button type="submit" className="cliente-button">
              {this.state.editId ? 'Atualizar' : 'Adicionar'}
            </button>
          </form>

          {/* Listagem dos clientes filtrados */}
          <ul className="cliente-list">
            {filteredClientes.length > 0 ? (
              filteredClientes.map(cliente => (
                <li key={cliente.id} className="cliente-item">
                  <span>{cliente.nome}</span>
                  <button onClick={() => this.handleEdit(cliente)} className="cliente-edit-button">Editar</button>
                  <button onClick={() => this.deleteCliente(cliente.id)} className="cliente-delete-button">Excluir</button>
                </li>
              ))
            ) : (
              <p>Nenhum cliente encontrado.</p>
            )}
          </ul>
        </div>

        <footer>
          
          <p>Descrição da Plataforma: Um sistema integrado para gerenciar o cadastro e agendamentos de clientes, facilitando a organização e atendimento.</p>
        </footer>
      </div>
    );
  }
}

export default Cliente;
