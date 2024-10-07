import React, { Component } from 'react';

class ClientSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchTerm: '',
            clients: [],
            filteredClients: [],
            agendamentosCliente: [],
            clienteSelecionado: null,
            loading: true,
            error: null,
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

     // Função para buscar agendamentos do cliente selecionado
     fetchAgendamentosCliente = async (nomeCliente) => {
        const { token } = this.state;
        if (token) {
            try {
                const response = await fetch(`http://localhost:8080/api/agendamentos/cliente/${nomeCliente}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Nenhum agendamento encontrado para este cliente');
                }

                const data = await response.json();
                this.setState({ agendamentosCliente: data, error: null });
            } catch (error) {
                this.setState({ agendamentosCliente: [], error: error.message });
                console.error('Erro ao buscar agendamentos:', error);
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

    // Função para tratar a seleção de cliente e chamar handleEdit do Cliente.js
    handleSelectClient = (client) => {
        this.props.onClientSelect(client);  // Chama o handleEdit passado como prop
        this.fetchAgendamentosCliente(client.nome);
    };



    render() {
        const { searchValue, filteredClients, agendamentosCliente, clienteSelecionado, error } = this.state;

        return (
            <div className="cliente-search-container" style={{ position: 'relative', width: '100%' }}>
                <input
                    type="text"
                    className="cliente-search"
                    value={searchValue}
                    onChange={this.handleSearch}
                    placeholder="Pesquisar Cliente"
                    style={{ width: '97%', padding: '10px', marginBottom: '15px', border: '1px solid #007bff', borderRadius: '4px', fontSize: '1em' }}
                />

                {/* Exibir sugestões apenas quando há texto e clientes filtrados */}
                {searchValue && filteredClients.length > 0 && (
                    <div className="suggestions" id="suggestionsContainer">
                        <ul id="suggestionsList">
                            {filteredClients.map(cliente => (
                                <li key={cliente.id} onClick={() => this.handleSelectClient(cliente)}>
                                    {cliente.nome} {/* Exibe o nome do cliente */}
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

                {/* Exibir agendamentos do cliente selecionado */}
                {clienteSelecionado && (
                    <div className="agendamentos-container">
                        <h2>Agendamentos de {clienteSelecionado.nome}</h2>

                        {agendamentosCliente.length > 0 ? (
                            <ul className="agendamentos-list">
                                {agendamentosCliente.map((agendamento) => (
                                    <li key={agendamento.id}>
                                        <p><strong>Data e Horário:</strong> {new Date(agendamento.dataHorario).toLocaleString('pt-BR')}</p>
                                        <p><strong>Tipo de Serviço:</strong> {agendamento.tipoServico}</p>
                                        <p><strong>Estabelecimento:</strong> {agendamento.estabelecimentoNome}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Este cliente não tem nenhum agendamento marcado.</p>
                        )}

                        {/* Exibir erro, se houver */}
                        {error && <p className="error">{error}</p>}
                    </div>
                )}
            </div>
        );
    }
}

export default ClientSearch;
