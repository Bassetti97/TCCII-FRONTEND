import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import ClientSearch from './ClientSearch';


class Agendamento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agendamentos: [],
      dataHorario: '',
      tipoServico: '',
      clienteNome: '', // Nome do cliente
      estabelecimentoNome: '', // Nome do estabelecimento
      searchTerm: '',
      editId: null,
      loading: true,
      error: null,
      clienteSelecionado: null,
    };
  }

  componentDidMount() {
    this.fetchAgendamentos();
  }

  // Método para buscar agendamentos (GET)
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

  // Método para adicionar um agendamento (POST)
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
        .then((response) => response.json())
        .then((data) => {
          this.setState((prevState) => ({
            agendamentos: [...prevState.agendamentos, data],
            dataHorario: '',
            tipoServico: '',
            clienteNome: '',
            estabelecimentoNome: '',
          }));
        })
        .catch((error) => {
          console.error('Erro ao adicionar agendamento:', error);
        });
    }
  };

  // Método para atualizar um agendamento (PUT)
  updateAgendamento = (id) => {
    const { dataHorario, tipoServico, clienteNome, estabelecimentoNome } = this.state;
    const token = localStorage.getItem('token');

    if (dataHorario && tipoServico && clienteNome && estabelecimentoNome) {
      fetch(`http://localhost:8080/api/agendamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8080/api/agendamentos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
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

  // Manipulador de pesquisa
  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  // Filtrar agendamentos pelo nome do cliente
  filterAgendamentos = () => {
    const { agendamentos, searchTerm } = this.state;

    if (searchTerm.trim() === '') {
      return [];
    }

    // Filtrar agendamentos que correspondem ao cliente pesquisado
    const agendamentosFiltrados = agendamentos.filter((agendamento) =>
      agendamento.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return agendamentosFiltrados;
  };

    // Preencher os dados no formulário para edição
    handleEditClick = (agendamento) => {
      this.setState({
        dataHorario: agendamento.dataHorario,
        tipoServico: agendamento.tipoServico,
        clienteNome: agendamento.clienteNome,
        estabelecimentoNome: agendamento.estabelecimentoNome,
        editId: agendamento.id,
      });
    };

  render() {
    const { agendamentos, dataHorario, tipoServico, clienteNome, estabelecimentoNome, loading, error, editId } = this.state;

    if (loading) {
      return <p className='agendamento-loading'>Carregando...</p>;
    }

    if (error) {
      return <p className='agendamento-error'>Erro: {error.message}</p>;
    }

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

          

          <h1 className='agendamento-title'>Agendamento de Horário</h1>

          
          <ClientSearch onClientSelect={this.handleClientSelect} />


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
            {agendamentos.map((agendamento) => {
              // Formatação da data e horário
              const dataHorarioFormatada = new Date(agendamento.dataHorario).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).replace(',', ' -'); // Troca a vírgula por " - "

              return (
                <li className='agendamento-item' key={agendamento.id}>
                  {dataHorarioFormatada} - {agendamento.tipoServico} - {agendamento.clienteNome} - {agendamento.estabelecimentoNome}
                  <div className="agendamento-button-group">
                    <button className='agendamento-edit-button' onClick={() => this.setState({
                      dataHorario: agendamento.dataHorario,
                      tipoServico: agendamento.tipoServico,
                      clienteNome: agendamento.clienteNome,
                      estabelecimentoNome: agendamento.estabelecimentoNome,
                      editId: agendamento.id,
                    })}>Editar
                    </button>
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
