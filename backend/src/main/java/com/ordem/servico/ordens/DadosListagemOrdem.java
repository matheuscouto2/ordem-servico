package com.ordem.servico.ordens;

import com.ordem.servico.clientes.Cliente;
import com.ordem.servico.tecnicos.Tecnico;

import java.time.LocalDate;

public record DadosListagemOrdem(Long id, Long clienteId, String clienteNome, Long tecnicoId, String tecnicoNome, String tecnicoEspecialidade, LocalDate abertura, String status, String descricao) {
    public DadosListagemOrdem(Ordem dados) {
        this(dados.getId(), dados.getCliente().getId(), dados.getCliente().getNome(), dados.getTecnico().getId(), dados.getTecnico().getNome(), dados.getTecnico().getEspecialidade(), dados.getAbertura(), dados.getStatus(), dados.getDescricao());
    }
}
