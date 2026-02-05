package com.ordem.servico.ordens;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ordem.servico.clientes.Cliente;
import com.ordem.servico.tecnicos.Tecnico;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "ordem")
@Entity(name = "ordens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Ordem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JoinColumn(name = "cliente_id")
    @ManyToOne
    Cliente cliente;
    @JoinColumn(name = "tecnico_id")
    @ManyToOne
    Tecnico tecnico;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate abertura;
    private String status;
    @Lob
    private String descricao;

    public Ordem(DadosCadastroOrdem dados, Cliente cliente, Tecnico tecnico) {
        this.abertura = dados.abertura();
        this.status = dados.status();
        this.descricao = dados.descricao();
        this.cliente = cliente;
        this.tecnico = tecnico;
    }

    public void atualizaInformacoes(DadosAlteracaoOrdem dados, Cliente cliente, Tecnico tecnico) {
        if (dados.abertura() != null) {
            this.abertura = dados.abertura();
        }
        if (dados.status() != null) {
            this.status = dados.status();
        }
        if (dados.descricao() != null) {
            this.descricao = descricao;
        }
        if (cliente != null) {
            this.cliente = dados.cliente();
        }
        if (tecnico != null) {
            this.tecnico = dados.tecnico();
        }
    }
}