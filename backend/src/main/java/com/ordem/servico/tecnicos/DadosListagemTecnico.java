package com.ordem.servico.tecnicos;

public record DadosListagemTecnico(Long id, String nome, String especialidade) {
    public DadosListagemTecnico(Tecnico dados) {
        this(dados.getId(), dados.getNome(), dados.getEspecialidade());
    }
}
