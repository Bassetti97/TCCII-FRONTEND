import React, { Component } from 'react';
import './App.css';

class Estabelecimento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estabelecimentos: [],
      nome: '',
      endereco: '',
      contato: '',
      editId: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchEstabelecimentos();
  }

  getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      this.setState({ error: 'Token não encontrado' });
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  fetchEstabelecimentos = () => {
    fetch('http://localhost:8080/api/estabelecimentos', {
      headers: this.getAuthHeaders(),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao carregar estabelecimentos');
        return response.json();
      })
      .then((data) => {
        this.setState({ estabelecimentos: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  };

  addEstabelecimento = () => {
    const { nome, endereco, contato } = this.state;

    if (nome && endereco && contato) {
      fetch('http://localhost:8080/api/estabelecimentos', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ nome, endereco, contato }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Erro ao adicionar estabelecimento');
          return response.json();
        })
        .then((data) => {
          this.setState((prevState) => ({
            estabelecimentos: [...prevState.estabelecimentos, data],
            nome: '',
            endereco: '',
            contato: '',
            editId: null,
          }));
        })
        .catch((error) => {
          this.setState({ error });
          console.error('Erro ao adicionar estabelecimento:', error);
        });
    } else {
      this.setState({ error: 'Todos os campos são obrigatórios.' });
    }
  };

  updateEstabelecimento = (id) => {
    const { nome, endereco, contato } = this.state;

    fetch(`http://localhost:8080/api/estabelecimentos/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ nome, endereco, contato }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao atualizar estabelecimento');
        return response.json();
      })
      .then((updatedEstabelecimento) => {
        this.setState((prevState) => ({
          estabelecimentos: prevState.estabelecimentos.map((estabelecimento) =>
            estabelecimento.id === id ? updatedEstabelecimento : estabelecimento
          ),
          nome: '',
          endereco: '',
          contato: '',
          editId: null,
        }));
      })
      .catch((error) => {
        this.setState({ error });
        console.error('Erro ao atualizar estabelecimento:', error);
      });
  };

  deleteEstabelecimento = (id) => {
    fetch(`http://localhost:8080/api/estabelecimentos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao remover estabelecimento');
        this.setState((prevState) => ({
          estabelecimentos: prevState.estabelecimentos.filter(
            (estabelecimento) => estabelecimento.id !== id
          ),
        }));
      })
      .catch((error) => {
        this.setState({ error });
        console.error('Erro ao remover estabelecimento:', error);
      });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { editId } = this.state;
    if (editId) {
      this.updateEstabelecimento(editId);
    } else {
      this.addEstabelecimento();
    }
  };

  render() {
    const { estabelecimentos, nome, endereco, contato, loading, error, editId } = this.state;

    if (loading) return <p className="estabelecimento-loading">Carregando...</p>;
    if (error) return <p className="estabelecimento-error">Erro: {error.message}</p>;

    return (
      <div className="estabelecimento-container">
        <h1 className="estabelecimento-title">Gerenciamento de Estabelecimentos</h1>

        <form className="estabelecimento-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="nome"
            className="estabelecimento-input"
            value={nome}
            onChange={this.handleInputChange}
            placeholder="Nome do Estabelecimento"
          />
          <input
            type="text"
            name="endereco"
            className="estabelecimento-input"
            value={endereco}
            onChange={this.handleInputChange}
            placeholder="Endereço"
          />
          <input
            type="text"
            name="contato"
            className="estabelecimento-input"
            value={contato}
            onChange={this.handleInputChange}
            placeholder="Contato"
          />
          <button type="submit" className="estabelecimento-button">
            {editId ? 'Atualizar' : 'Adicionar'}
          </button>
        </form>

        <ul className="estabelecimento-list">
          {estabelecimentos.map((estabelecimento) => (
            <li key={estabelecimento.id} className="estabelecimento-item">
              {estabelecimento.nome} - {estabelecimento.endereco} - {estabelecimento.contato}{' '}
              <button
                className="estabelecimento-button-edit"
                onClick={() =>
                  this.setState({
                    nome: estabelecimento.nome,
                    endereco: estabelecimento.endereco,
                    contato: estabelecimento.contato,
                    editId: estabelecimento.id,
                  })
                }
              >
                Editar
              </button>
              <button
                className="estabelecimento-button-delete"
                onClick={() => this.deleteEstabelecimento(estabelecimento.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Estabelecimento;
