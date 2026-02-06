function loadDashboard() {
    ativarMenu("dash");

    fetch(API + "/dashboard", {
        headers: getHeaders()
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar dashboard");
            }
            return response.json();
        })
        .then(data => {
            renderDashboard(data);
        })
        .catch(err => {
            Swal.fire("Erro", err.message, "error");
        });
}

function renderDashboard(d) {
    const html = `
        <h2>Dashboard</h2>

        <div class="dashboard-cards">
            <div class="card">
                <span style="color: #0f172a;">Total</span>
                <strong style="color: #0f172a;">${d.total}</strong>
            </div>

            <div class="card warning">
                <span style="color: #422006;">Abertas</span>
                <strong style="color: #422006;">${d.abertas}</strong>
            </div>

            <div class="card info">
                <span style="color: #1e293b;">Em Atendimento</span>
                <strong style="color: #1e293b;">${d.emAtendimento}</strong>
            </div>

            <div class="card success">
                <span style="color: #064e3b;">Finalizadas</span>
                <strong style="color: #064e3b;">${d.finalizadas}</strong>
            </div>

            <div class="card danger">
                <span style="color: #450a0a;">Canceladas</span>
                <strong style="color: #450a0a;">${d.canceladas}</strong>
            </div>
        </div>

        <h3 style="margin-top:30px;">Visão Geral</h3>

        <div class="dashboard-graficos">
            <div class="grafico-box">
                <canvas id="graficoStatus"></canvas>
            </div>

            <div class="grafico-box">
                <canvas id="graficoAberturas"></canvas>
            </div>
        </div>


        <h3 style="padding-top: 30px;">Últimas Ordens</h3>

        <table class="tabela" style="margin-top: 5px;">
            <thead>
                <tr>
                    <th></th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Técnico</th>
                    <th>Descrição</th>
                </tr>
            </thead>
            <tbody>
                ${d.ultimasOrdens.map(o => `
                    <tr>
                        <td><span class="status ${o.status}">${o.status.replace("_", " ")}</span></td>
                        <td>${formatarData(o.abertura)}</td>
                        <td>${o.clienteNome}</td>
                        <td>${o.tecnicoNome}</td>
                        <td>${o.descricao}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    document.getElementById("conteudo").innerHTML = html;

    
setTimeout(() => {
    renderGraficoStatus(d);
    carregarGraficoAberturas();
}, 0);
}

function renderGraficoStatus(d) {
    const ctx = document.getElementById("graficoStatus");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Abertas", "Em Atendimento", "Finalizadas", "Canceladas"],
            datasets: [{
                data: [
                    d.abertas,
                    d.emAtendimento,
                    d.finalizadas,
                    d.canceladas
                ],
                backgroundColor: [
                    "#f59e0b",
                    "#3b82f6",
                    "#22c55e",
                    "#ef4444"
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "#64748b"
                    }
                }
            }
        }
    });
}

function carregarGraficoAberturas() {
    fetch(API + "/dashboard/ordensPorDia", {
        headers: getHeaders()
    })
        .then(res => res.json())
        .then(dados => {
            const labels = dados.map(d => formatarData(d.data));
            const valores = dados.map(d => d.total);

            const ctx = document.getElementById("graficoAberturas");

            new Chart(ctx, {
                type: "line",
                data: {
                    labels,
                    datasets: [{
                        label: "Ordens Abertas",
                        data: valores,
                        borderColor: "#38bdf8",
                        backgroundColor: "rgba(56,189,248,.2)",
                        tension: 0.3
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: { color: "#e5e7eb" }
                        }
                    },
                    scales: {
                        x: { ticks: { color: "#cbd5f5" } },
                        y: { ticks: { color: "#cbd5f5" } }
                    }
                }
            });
        });
}

function formatarData(data) {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}