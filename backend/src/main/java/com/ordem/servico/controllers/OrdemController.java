package com.ordem.servico.controllers;

import com.ordem.servico.clientes.Cliente;
import com.ordem.servico.clientes.ClienteRepositorio;
import com.ordem.servico.ordens.*;
import com.ordem.servico.tecnicos.Tecnico;
import com.ordem.servico.tecnicos.TecnicoRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/ordens")
public class OrdemController {
    @Autowired
    private OrdemRepositorio ordemRepositorio;
    @Autowired
    private ClienteRepositorio clienteRepositorio;
    @Autowired
    private TecnicoRepositorio tecnicoRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroOrdem dados) {
        if (!clienteRepositorio.existsById(dados.clienteId())) {
            return ResponseEntity.notFound().build();
        }
        if (!tecnicoRepositorio.existsById(dados.tecnicoId())) {
            return ResponseEntity.notFound().build();
        }
        Cliente cliente = clienteRepositorio.getReferenceById(dados.clienteId());
        Tecnico tecnico = tecnicoRepositorio.getReferenceById(dados.tecnicoId());
        Ordem ordem = ordemRepositorio.save(new Ordem(dados, cliente, tecnico));
        Long id = ordem.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = ordemRepositorio.findAll().stream().map(DadosListagemOrdem::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> atualizar(@RequestBody DadosAlteracaoOrdem dados) {
        if (!ordemRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        if (!clienteRepositorio.existsById(dados.clienteId())) {
            return ResponseEntity.notFound().build();
        }
        if (!tecnicoRepositorio.existsById(dados.tecnicoId())) {
            return ResponseEntity.notFound().build();
        }
        Cliente cliente = clienteRepositorio.getReferenceById(dados.clienteId());
        Tecnico tecnico = tecnicoRepositorio.getReferenceById(dados.tecnicoId());
        Ordem ordem = ordemRepositorio.getReferenceById(dados.id());
        ordem.atualizaInformacoes(dados, cliente, tecnico);
        return ResponseEntity.ok(ordem);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!ordemRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ordemRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemOrdem> detalhar(@PathVariable Long id) {
        if (!ordemRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Ordem ordem = ordemRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemOrdem(ordem));
    }
}
