function loadTecnicos() {
    ativarMenu("tecnicos");
    fetch(API + "/tecnicos", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {
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

            data.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td>${b.nome}</td>
                        <td>${b.especialidade}</td>
                         <td class="col-acoes">
                            <button onclick="editarOrdem(${b.id})" class="icon-btn edit"><i class="fa fa-edit"></i></button>
                            <button onclick="excluirOrdem(${b.id})" class="icon-btn delete"><i class="fa fa-times"></i></button>
                        </td>
                    </tr>
                `;
            });

            html += "</table>";
            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoTecnico() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Novo Técnico</h2>

        <input id="nome" type="text" placeholder="Nome">
        <input id="especialidade" type="text" placeholder="Especialidade">

        <button onclick="salvarTecnico()">Salvar</button>
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
                <h2>Editar Técnico</h2>

                <input id="id" type="hidden" value="${tecnico.id}">
                <input id="nome" type="text" value="${tecnico.nome}">
                <input id="especialidade" type="text" value="${tecnico.especialidade}">
                <button onclick="atualizarTecnico()">Atualizar</button>
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