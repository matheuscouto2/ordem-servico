function loadTecnicos(pagina = 1) {
    ativarMenu("tecnicos");
    fetch(API + "/tecnicos", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {

            const itensPorPagina = 15;
            const totalPaginas = Math.ceil(data.length / itensPorPagina);
            const inicio = (pagina - 1) * itensPorPagina;
            const fim = inicio + itensPorPagina;
            const dadosPaginados = data.slice(inicio, fim);

            let html = `
                <div class="div-header-container">
                    <h2>Técnicos</h2>
                    <button class="btn-novo" onclick="formNovoTecnico()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display:none;">ID</th>
                        <th>Nome</th>
                        <th>Especialidade</th>
                        <th class="col-acoes"></th>
                    </tr>
            `;

            dadosPaginados.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td>${b.nome}</td>
                        <td>${b.especialidade}</td>
                         <td class="col-acoes">
                            <button onclick="editarTecnico(${b.id})" class="icon-btn edit"><i class="fa fa-edit"></i></button>
                            <button onclick="excluirTecnico(${b.id})" class="icon-btn delete"><i class="fa fa-times"></i></button>
                        </td>
                    </tr>
                `;
            });

            html += "</table>";

            // Paginação
            html += `<div class="paginacao">`;

            for (let i = 1; i <= totalPaginas; i++) {
                html += `
                    <button 
                        onclick="loadTecnicos(${i})" 
                        class="${i === pagina ? "active-page" : ""}">
                        ${i}
                    </button>
                `;
            }

            html += `</div>`;

            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoTecnico() {
    document.getElementById("conteudo").innerHTML = `
        <div class="form-container">
            <h2>Vamos criar algo novo?</h2>

            <div class="form-grid">
                <div class="form-group">
                    <label>Nome</label>
                    <input id="nome" type="text" placeholder="Digite o nome">
                </div>

                <div class="form-group">
                    <label>Especialidade</label>
                    <input id="especialidade" type="text" placeholder="Digite a especialidade">
                </div>
            </div>

            <div class="form-actions">
                <button class="btn-secondary" onclick="loadTecnicos()">Cancelar</button>
                <button class="btn-primary" onclick="salvarTecnico()">Salvar</button>
            </div>
        </div>
    `;
}

function salvarTecnico() {
    const nome = document.getElementById("nome").value;
    const especialidade = document.getElementById("especialidade").value;
    
    fetch(API + "/tecnicos", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            nome,
            especialidade
        })
    })
        .then(async response => {
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Erro ao salvar técnico");
            }
        })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Técnico registrado com sucesso"
            });
            loadTecnicos();
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: error.message
            });
        });
}

function editarTecnico(id) {
    fetch(API + "/tecnicos/" + id, { headers: getHeaders() })
        .then(res => res.json())
        .then(tecnico => {
            document.getElementById("conteudo").innerHTML = `
                <div class="form-container">
                    <h2>Hora de mexer nos detalhes...</h2>

                    <input id="id" type="hidden" value="${tecnico.id}">

                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nome</label>
                            <input id="nome" type="text" value="${tecnico.nome}" placeholder="Digite o nome">
                        </div>

                        <div class="form-group">
                            <label>Especialidade</label>
                            <input id="especialidade" type="text" value="${tecnico.especialidade}" placeholder="Digite a especialidade">
                        </div>
                    </div>

                    <div class="form-actions">
                        <button class="btn-secondary" onclick="loadTecnicos()">Cancelar</button>
                        <button class="btn-primary" onclick="atualizarTecnico()">Atualizar</button>
                    </div>
                </div>
            `;
        });
}

function atualizarTecnico() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const especialidade = document.getElementById("especialidade").value;

    fetch(API + "/tecnicos", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, nome, especialidade })
    }).then(() => loadTecnicos());
}

function excluirTecnico(id) {
    fetch(API + "/tecnicos/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadTecnicos());
}