package com.ordem.servico.ordens;

import com.ordem.servico.clientes.Cliente;
import com.ordem.servico.tecnicos.Tecnico;

import java.time.LocalDate;

public record DadosAlteracaoOrdem(Long id, Long clienteId, Long tecnicoId, LocalDate abertura, String status, String descricao) { }
