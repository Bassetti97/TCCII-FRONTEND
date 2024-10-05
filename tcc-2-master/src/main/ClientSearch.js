import React, { Component } from 'react';

class ClientSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            clients: [],
            filteredClients: [],
            token: localStorage.getItem('token'),
        };
    }

    componentDidMount() {
        this.fetchClients();
    }

    fetchClients = async () => {
        const { token } = this.state;
        if (token) {
            try {
                const response = await fetch('http://localhost:8080/api/clientes', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                this.setState({ clients: data });
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        }
    };

    handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase(); // Converte o valor da pesquisa para minúsculas
        this.setState({ searchValue });

        const { clients } = this.state;
        // Filtrando clientes com base na pesquisa, ignorando maiúsculas e minúsculas
        const filteredClients = clients.filter(client =>
            client.nome.toLowerCase().includes(searchValue) // Converte o nome do cliente para minúsculas
        );
        this.setState({ filteredClients });
    };

    handleEdit = (client) => {
        // Lógica para editar o cliente
        console.log('Cliente selecionado para edição:', client);
    };

    render() {
        const { searchValue, filteredClients } = this.state;

        return (
            <div className="cliente-container" style={{ position: 'relative', width: '100%' }}>
                <input
                    type="text"
                    className="cliente-search"
                    value={searchValue}
                    onChange={this.handleSearch}
                    placeholder="Pesquisar Cliente"
                    style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1em' }}
                />
                {/* Exibir sugestões apenas quando há texto e clientes filtrados */}
                {searchValue && filteredClients.length > 0 && (
                    <div className="suggestions" id="suggestionsContainer">
                        <ul id="suggestionsList">
                            {filteredClients.map(cliente => (
                                <li key={cliente.id} onClick={() => this.handleEdit(cliente)}>
                                    {cliente.nome} {/* Exibindo apenas o nome do cliente */}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Mensagem caso não haja clientes filtrados */}
                {searchValue && filteredClients.length === 0 && (
                    <div className="suggestions" id="suggestionsContainer">
                        <ul id="suggestionsList">
                            <li>Nenhum cliente encontrado.</li>
                        </ul>
                    </div>
                )}
                <ul className="cliente-list" id="clientList">
                    {/* Lista de clientes cadastrados, se necessário */}
                </ul>
            </div>
        );
    }
}

export default ClientSearch;
