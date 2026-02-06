package com.ordem.servico.ordens;

import com.ordem.servico.indicadores.DadosGraficoData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrdemRepositorio extends JpaRepository<Ordem, Long> {
    List<Ordem> findTop5ByOrderByAberturaDesc();

    long countByStatus(String status);

    @Query("""
    SELECT new com.ordem.servico.indicadores.DadosGraficoData(
        o.abertura, COUNT(o)
    )
    FROM ordens o
    GROUP BY o.abertura
    ORDER BY o.abertura
""")
    List<DadosGraficoData> ordensPorDia();

}
