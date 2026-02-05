package com.ordem.servico.controllers;

import com.ordem.servico.clientes.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @Autowired
    private ClienteRepositorio clienteRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroCliente dados) {
        Cliente cliente = clienteRepositorio.save(new Cliente(dados));
        Long id = cliente.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = clienteRepositorio.findAll().stream().map(DadosListagemCliente::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> atualizar(@RequestBody DadosAlteracaoCliente dados) {
        if (!clienteRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Cliente cliente = clienteRepositorio.getReferenceById(dados.id());
        cliente.atualizaInformacoes(dados);
        return ResponseEntity.ok(dados);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!clienteRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clienteRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemCliente> detalhar(@PathVariable Long id) {
        if (!clienteRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Cliente cliente = clienteRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemCliente(cliente));
    }
}