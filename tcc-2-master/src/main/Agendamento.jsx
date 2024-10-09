import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import ClientSearch from './ClientSearch';
import AgendamentoSearch from './AgendamentoSearch';

class Agendamento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agendamentosCliente: [],
      agendamentos: [],
      dataHorario: '',
      tipoServico: '',
      clienteNome: '',
      estabelecimentoNome: '',
      searchTerm: '',
      editId: null,
      loading: true,
      error: null,
      clienteSelecionado: null,
      showMenu: false, // Controle para mostrar/ocultar o menu
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.fetchAgendamentos();
  }

  fetchAgendamentos = () => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/api/agendamentos', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ agendamentos: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ showMenu: !prevState.showMenu }));
  };

  addAgendamento = () => {
    const { dataHorario, tipoServico, clienteNome, estabelecimentoNome } = this.state;
    const token = localStorage.getItem('token');

    if (dataHorario && tipoServico && clienteNome && estabelecimentoNome) {
      fetch('http://localhost:8080/api/agendamentos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataHorario, tipoServico, clienteNome, estabelecimentoNome }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || 'Erro ao adicionar agendamento');
            });
          }
          return response.json();
        })
        .then((data) => {
          this.setState((prevState) => ({
            agendamentos: [...prevState.agendamentos, data],
            dataHorario: '',
            tipoServico: '',
            clienteNome: '',
            estabelecimentoNome: '',
            errorMessage: null,
          }));
        })
        .catch((error) => {
          this.setState({ errorMessage: error.message });
        });
    } else {
      this.setState({ errorMessage: 'Por favor, preencha todos os campos!' });
    }
  };

  // Outros métodos permanecem os mesmos...

  render() {
    const { agendamentos, dataHorario, tipoServico, clienteNome, estabelecimentoNome, loading, error, editId, errorMessage, clienteSelecionado, agendamentosCliente, showMenu } = this.state;

    if (loading) {
      return <p className='agendamento-loading'>Carregando...</p>;
    }

    if (error) {
      return <p className='agendamento-error'>Erro: {error.message}</p>;
    }



    
    const agendamentosFuturos = agendamentos
      .filter(agendamento => new Date(agendamento.dataHorario) > new Date())
      .sort((a, b) => new Date(a.dataHorario) - new Date(b.dataHorario));

    return (
      <div className='agendamento-home-container'>
        <header>
          <nav>
            <div className="ponto-icon" onClick={this.toggleMenu}>
              &#x22EE; {/* Ícone de três pontinhos */}
              
            </div>
            <h2 className="home-h2">BeautyBooker</h2>
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

        <div className='agendamento-container'>
          <h1 className='agendamento-title'>Agendamento de Horários</h1>

          <ClientSearch onClientSelect={this.handleSelectClient} />
          {clienteSelecionado && (<AgendamentoSearch cliente={clienteSelecionado} agendamentos={agendamentosCliente}/>)}

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <form className='agendamento-form' onSubmit={this.handleSubmit}>
            <input
              type="datetime-local"
              name="dataHorario"
              value={dataHorario}
              onChange={this.handleInputChange}
              className='agendamento-input'
              placeholder="Data e Horário"
            />
            <input
              type="text"
              name="tipoServico"
              value={tipoServico}
              onChange={this.handleInputChange}
              className='agendamento-input'
              placeholder="Tipo de Serviço"
            />
            <input
              type="text"
              name="clienteNome"
              value={clienteNome}
              onChange={this.handleInputChange}
              className='agendamento-input'
              placeholder="Nome do Cliente"
            />
            <input
              type="text"
              name="estabelecimentoNome"
              value={estabelecimentoNome}
              onChange={this.handleInputChange}
              className='agendamento-input'
              placeholder="Nome do Estabelecimento"
            />
            <button className='agendamento-button' type="submit">
              {editId ? 'Atualizar' : 'Adicionar'}
            </button>
          </form>

          <ul className='agendamento-list'>
            {agendamentosFuturos.map((agendamento) => {
              const data = new Date(agendamento.dataHorario).toLocaleDateString('pt-BR');
              const horario = new Date(agendamento.dataHorario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

              return (
                <li className='agendamento-item' key={agendamento.id}>
                  <div className="agendamento-details">
                    <p>Data: {data}</p>
                    <p>Horário: {horario}</p>
                    <p>Cliente: {agendamento.cliente.nome}</p>
                    <p>Estabelecimento: {agendamento.estabelecimento.nome}</p>
                    <p>Serviço: {agendamento.tipoServico}</p>
                  </div>
                  <div className="agendamento-button-group">
                    <button className='agendamento-edit-button' onClick={() => this.handleEditClick(agendamento)}>Editar</button>
                    <button className='agendamento-delete-button' onClick={() => this.deleteAgendamento(agendamento.id)}>Excluir</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Agendamento;
