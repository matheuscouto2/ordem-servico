package com.ordem.servico.ordens;

import com.ordem.servico.clientes.Cliente;
import com.ordem.servico.tecnicos.Tecnico;

import java.time.LocalDate;

public record DadosCadastroOrdem(Long clienteId, Long tecnicoId, LocalDate abertura, String descricao) { }
