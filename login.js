import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estabelecimentos: [],
      nome: '',
      editId: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    // Buscar todos os estabelecimentos ao montar o componente
    this.fetchEstabelecimentos();
  }

  // Método para buscar estabelecimentos (GET)
  fetchEstabelecimentos = () => {
    fetch('/api/estabelecimentos')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ estabelecimentos: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  };

  // Método para adicionar um estabelecimento (POST)
  addEstabelecimento = () => {
    const { nome } = this.state;
    if (nome) {
      fetch('/api/estabelecimentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState((prevState) => ({
            estabelecimentos: [...prevState.estabelecimentos, data],
            nome: '',
          }));
        })
        .catch((error) => {
          console.error('Erro ao adicionar estabelecimento:', error);
        });
    }
  };

  // Método para atualizar um estabelecimento (PUT)
  updateEstabelecimento = (id) => {
    const { nome } = this.state;
    if (nome) {
      fetch(`/api/estabelecimentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome }),
      })
        .then((response) => response.json())
        .then((updatedEstabelecimento) => {
          this.setState((prevState) => ({
            estabelecimentos: prevState.estabelecimentos.map((estabelecimento) =>
              estabelecimento.id === id ? updatedEstabelecimento : estabelecimento
            ),
            nome: '',
            editId: null,
          }));
        })
        .catch((error) => {
          console.error('Erro ao atualizar estabelecimento:', error);
        });
    }
  };

  // Método para deletar um estabelecimento (DELETE)
  deleteEstabelecimento = (id) => {
    fetch(`/api/estabelecimentos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        this.setState((prevState) => ({
          estabelecimentos: prevState.estabelecimentos.filter(
            (estabelecimento) => estabelecimento.id !== id
          ),
        }));
      })
      .catch((error) => {
        console.error('Erro ao remover estabelecimento:', error);
      });
  };

  // Manipulador de input
  handleInputChange = (e) => {
    this.setState({ nome: e.target.value });
  };

  // Manipulador de submit para adição/edição
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
    const { estabelecimentos, nome, loading, error, editId } = this.state;

    if (loading) {
      return <p>Carregando...</p>;
    }

    if (error) {
      return <p>Erro: {error.message}</p>;
    }

    return (
      <div>
        <h1>Gerenciamento de Estabelecimentos</h1>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={nome}
            onChange={this.handleInputChange}
            placeholder="Nome do Estabelecimento"
          />
          <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
        </form>

        <ul>
          {estabelecimentos.map((estabelecimento) => (
            <li key={estabelecimento.id}>
              {estabelecimento.nome}{' '}
              <button
                onClick={() =>
                  this.setState({ nome: estabelecimento.nome, editId: estabelecimento.id })
                }
              >
                Editar
              </button>
              <button onClick={() => this.deleteEstabelecimento(estabelecimento.id)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
