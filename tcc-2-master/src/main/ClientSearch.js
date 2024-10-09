import React, { Component } from 'react';

class ClientSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            clients: [],
            filteredClients: [],
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
                const response = await fetch(`https://lovely-solace-production.up.railway.app/api/clientes`, {
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
                this.setState({ clients: data, loading: false });
            } catch (error) {
                this.setState({ loading: false, error: error.message });
                console.error('Erro ao buscar clientes:', error);
            }
        }
    };

    handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        this.setState({ searchValue });

        const { clients } = this.state;
        const filteredClients = clients.filter(client =>
            client.nome.toLowerCase().includes(searchValue)
        );
        this.setState({ filteredClients });
    };

    handleSelectClient = (client) => {
        this.props.onClientSelect(client);  // Chama a função passada como prop
    };

    render() {
        const { searchValue, filteredClients, loading, error } = this.state;

        return (

            <div className="cliente-search-container" style={{ position: 'relative', width: '97%' }}>
                <input
                    type="text"
                    className="cliente-search"
                    value={searchValue}
                    onChange={this.handleSearch}
                    placeholder="Pesquisar Cliente"
                    style={{ width: '97%', padding: '10px', marginBottom: '15px', border: '1px solid #007bff', borderRadius: '4px', fontSize: '1em' }}
                />

                {loading && <p>Carregando clientes...</p>}
                {error && <p className="error">{error}</p>}

                {searchValue && filteredClients.length > 0 && (
                    <div className="suggestions">
                        <ul>
                            {filteredClients.map(cliente => (
                                <li key={cliente.id} onClick={() => this.handleSelectClient(cliente)}>
                                    {cliente.nome}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {searchValue && filteredClients.length === 0 && (
                    <div className="suggestions">
                        <ul>
                            <li>Nenhum cliente encontrado.</li>
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default ClientSearch;
