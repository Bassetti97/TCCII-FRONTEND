import React, { Component } from 'react';

class AgendamentoSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            agendamentos: [],
            loading: false,
            error: null,
            token: localStorage.getItem('token'),
        };
    }

    // Pesquisar o cliente pelo nome (GET)
    handleSearch = (e) => {
        const nomeCliente = e.target.value;
        this.setState({ nomeCliente, loading: true });

        if (nomeCliente.length > 0) {
            const { token } = this.state;

            fetch(`https://lovely-solace-production.up.railway.app/api/agendamentos/cliente/${nomeCliente}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Nenhum agendamento encontrado para este cliente');
                    }
                    return response.json();
                })
                .then((data) => {
                    const sortedAgendamentos = data.sort((a, b) => {
                        return new Date(b.dataHorario) - new Date(a.dataHorario);

                    });
                    this.setState({ agendamentos: sortedAgendamentos, loading: false, error: null });
                })
                .catch((error) => {
                    this.setState({ agendamentos: [], loading: false, error: error.message });
                    console.error('Erro ao buscar agendamentos:', error);
                });
        } else {
            this.setState({ agendamentos: [], loading: false });
        }
    };

    render() {
        const { nomeCliente, agendamentos, loading, error } = this.state;

        return (
            <div className="agendamento-search-container" style={{ position: 'relative', width: '97%' }}>
                <input
                    type="text"
                    className="agendamento-search"
                    value={nomeCliente}
                    onChange={this.handleSearch}
                    placeholder="Pesquisar Cliente"
                    style={{ width: '97%', padding: '10px', marginBottom: '15px', border: '1px solid #007bff', borderRadius: '4px', fontSize: '1em' }}
                />

                {loading && <p>Carregando agendamentos...</p>}
                {error && <p className="error">{error}</p>}

                {nomeCliente && agendamentos.length > 0 && (
                    <div className="suggestions">
                        <ul>
                            {agendamentos.map(agendamento => (
                                <li key={agendamento.id}>
                                    {`Data: ${new Date(agendamento.dataHorario).toLocaleString()} - Serviço: ${agendamento.tipoServico} - Cliente: ${nomeCliente} - Estabelecimento: ${agendamento.estabelecimento.nome}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {nomeCliente && agendamentos.length === 0 && (
                    <div className="suggestions">
                        <ul>
                            <li>Nenhum agendamento encontrado.</li>
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default AgendamentoSearch;
