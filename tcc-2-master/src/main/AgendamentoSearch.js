import React from 'react';

const AgendamentoSearch = ({ agendamentos, cliente }) => {
    return (
        <div className="agendamentos-container">
     
            <h2>Agendamentos de {cliente.nome}</h2>

            {agendamentos.length > 0 ? (
                <ul className="agendamentos-list">
                    {agendamentos.map((agendamento) => (
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
        </div>
    );
};

export default AgendamentoSearch;
