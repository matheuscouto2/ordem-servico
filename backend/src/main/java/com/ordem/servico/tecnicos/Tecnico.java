package com.ordem.servico.tecnicos;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "tecnico")
@Entity(name = "tecnicos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Tecnico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String especialidade;

    public Tecnico(DadosCadastroTecnico dados) {
        this.nome = dados.nome();
        this.especialidade = dados.especialidade();
    }

    public void atualizaInformacoes(DadosAlteracaoTecnico dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.especialidade() != null) {
            this.especialidade = dados.especialidade();
        }
    }
}
