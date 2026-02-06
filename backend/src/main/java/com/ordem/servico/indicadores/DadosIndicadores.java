package com.ordem.servico.indicadores;

import java.util.List;

public record DadosIndicadores(long total, long abertas, long emAtendimento, long finalizadas, long canceladas, List<DadosIndicadoresOrdem> ultimasOrdens) { }
