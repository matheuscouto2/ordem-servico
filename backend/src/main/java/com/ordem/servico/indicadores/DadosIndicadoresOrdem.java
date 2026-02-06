package com.ordem.servico.indicadores;

import com.ordem.servico.ordens.Ordem;

import java.time.LocalDate;

public record DadosIndicadoresOrdem(LocalDate abertura, String clienteNome, String tecnicoNome, String descricao, String status) {
    public DadosIndicadoresOrdem(Ordem o) {
        this(o.getAbertura(), o.getCliente().getNome(), o.getTecnico().getNome(), o.getDescricao(), o.getStatus());
    }
}
