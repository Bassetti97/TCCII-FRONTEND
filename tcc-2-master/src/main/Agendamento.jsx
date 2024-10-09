import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import AgendamentoSearch from './AgendamentoSearch';


class Agendamento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agendamentos: [],
      dataHorario: '',
      tipoServico: '',
      clienteNome: '',
      estabelecimentoNome: '',
      searchTerm: '',
      editId: null,
      loading: true,
      error: null,
      clients: [],
      filteredClients: [],
    };
  }

  token = localStorage.getItem('token');

  componentDidMount() {
    this.fetchAgendamentos();
  }

  // Método para buscar agendamentos (GET)
  fetchAgendamentos = () => {
    fetch(`https://lovely-solace-production.up.railway.app/api/agendamentos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
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

  // Método para adicionar um agendamento (POST)
  addAgendamento = () => {
    const { dataHorario, tipoServico, clienteNome, estabelecimentoNome } = this.state;

    if (dataHorario && tipoServico && clienteNome && estabelecimentoNome) {
      fetch(`https://lovely-solace-production.up.railway.app/api/agendamentos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
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


  // Método para atualizar um agendamento (PUT)
  updateAgendamento = (id) => {
    const { dataHorario, tipoServico, clienteNome, estabelecimentoNome } = this.state;

    if (dataHorario && tipoServico && clienteNome && estabelecimentoNome) {
      fetch(`https://lovely-solace-production.up.railway.app/api/agendamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataHorario, tipoServico, clienteNome, estabelecimentoNome }),
      })
        .then((response) => response.json())
        .then((updatedAgendamento) => {
          this.setState((prevState) => ({
            agendamentos: prevState.agendamentos.map((agendamento) =>
              agendamento.id === id ? updatedAgendamento : agendamento
            ),
            dataHorario: '',
            tipoServico: '',
            clienteNome: '',
            estabelecimentoNome: '',
            editId: null,
          }));
        })
        .catch((error) => {
          console.error('Erro ao atualizar agendamento:', error);
        });
    }
  };

  // Método para deletar um agendamento (DELETE)
  deleteAgendamento = (id) => {
    fetch(`https://lovely-solace-production.up.railway.app/api/agendamentos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        this.setState((prevState) => ({
          agendamentos: prevState.agendamentos.filter((agendamento) => agendamento.id !== id),
        }));
      })
      .catch((error) => {
        console.error('Erro ao remover agendamento:', error);
      });
  };

  // Manipulador de input
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Manipulador de submit para adição/edição
  handleSubmit = (e) => {
    e.preventDefault();
    const { editId } = this.state;
    if (editId) {
      this.updateAgendamento(editId);
    } else {
      this.addAgendamento();
    }
  };

  // Preencher os dados no formulário para edição
  handleEditClick = (agendamento) => {
    this.setState({
      dataHorario: agendamento.dataHorario,
      tipoServico: agendamento.tipoServico,
      clienteNome: agendamento.cliente.nome,
      estabelecimentoNome: agendamento.estabelecimento.nome,
      editId: agendamento.id,
    });
  };

  render() {
    const { agendamentos, dataHorario, tipoServico, clienteNome, estabelecimentoNome, loading, error, editId, errorMessage } = this.state;

    if (loading) {
      return <p className='cliente-loading'>Carregando...</p>;
    }

    if (error) {
      return <p className='agendamento-error'>Erro: {error.message}</p>;
    }

    // Filtrar agendamentos que já passaram e ordenar por data e horário
    const agendamentosFuturos = agendamentos
      .filter(agendamento => new Date(agendamento.dataHorario) > new Date())
      .sort((a, b) => new Date(a.dataHorario) - new Date(b.dataHorario));

    return (
      <div className='agendamento-home-container'>
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

        <div className='agendamento-container'>
          <h1 className='agendamento-title'>Agendamento de Horários</h1>


          <AgendamentoSearch />

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
