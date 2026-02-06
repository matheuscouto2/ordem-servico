package com.ordem.servico.controllers;

import com.ordem.servico.indicadores.DadosGraficoData;
import com.ordem.servico.indicadores.DadosIndicadores;
import com.ordem.servico.indicadores.DadosIndicadoresOrdem;
import com.ordem.servico.ordens.OrdemRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    @Autowired
    private OrdemRepositorio ordemRepositorio;

    @GetMapping
    public ResponseEntity<?> dadosDashboard() {
        long total = ordemRepositorio.count();
        long abertas = ordemRepositorio.countByStatus("ABERTA");
        long emAtendimento = ordemRepositorio.countByStatus("EM_ANDAMENTO");
        long finalizadas = ordemRepositorio.countByStatus("FINALIZADA");
        long canceladas = ordemRepositorio.countByStatus("CANCELADA");

        var ultimasOrdens = ordemRepositorio.findTop5ByOrderByAberturaDesc().stream().map(DadosIndicadoresOrdem::new).toList();
        return ResponseEntity.ok(new DadosIndicadores(total, abertas, emAtendimento, finalizadas, canceladas, ultimasOrdens));
    }

    @GetMapping("/ordensPorDia")
    public List<DadosGraficoData> ordensPorDia() {
        return ordemRepositorio.ordensPorDia();
    }
}
