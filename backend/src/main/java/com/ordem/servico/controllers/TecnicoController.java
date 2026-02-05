package com.ordem.servico.controllers;

import com.ordem.servico.tecnicos.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/tecnicos")
public class TecnicoController {
    @Autowired
    private TecnicoRepositorio tecnicoRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroTecnico dados) {
        Tecnico tecnico = tecnicoRepositorio.save(new Tecnico(dados));
        Long id = tecnico.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = tecnicoRepositorio.findAll().stream().map(DadosListagemTecnico::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> atualizar(@RequestBody DadosAlteracaoTecnico dados) {
        if (!tecnicoRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Tecnico tecnico = tecnicoRepositorio.getReferenceById(dados.id());
        tecnico.atualizaInformacoes(dados);
        return ResponseEntity.ok(dados);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!tecnicoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tecnicoRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemTecnico> detalhar(@PathVariable Long id) {
        if (!tecnicoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Tecnico tecnico = tecnicoRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemTecnico(tecnico));
    }
}
