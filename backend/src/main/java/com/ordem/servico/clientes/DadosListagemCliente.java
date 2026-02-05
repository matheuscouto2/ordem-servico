package com.ordem.servico.clientes;

public record DadosListagemCliente(Long id, String nome, String telefone, String email) {
    public DadosListagemCliente(Cliente dados) {
        this(dados.getId(), dados.getNome(), dados.getTelefone(), dados.getEmail());
    }
}
