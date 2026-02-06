function loadOrdens() {
    ativarMenu("ordens");
    fetch(API + "/ordens", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {
            let html = `
                <div class="div-header-container">
                    <h2>Ordens de Serviço</h2>
                    <button onclick="formNovoOrdem()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display:none;">ID</th>
                        <th class="col-acoes"></th>
                        <th>Cliente</th>
                        <th>Técnico</th>
                        <th>Abertura</th>
                        <th>Status</th>
                        <th>Descrição</th>
                    </tr>
            `;

            data.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td class="col-acoes">
                            <button onclick="editarOrdem(${b.id})">Editar</button>
                            <button onclick="excluirOrdem(${b.id})">Excluir</button>
                        </td>
                        <td>${b.clienteNome}</td>
                        <td>${b.tecnicoNome}</td>
                        <td>${formatarData(b.abertura)}</td>
                        <td>${b.status}</td>
                        <td>${b.descricao}</td>
                    </tr>
                `;
            });

            html += "</table>";
            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoOrdem() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Nova Ordem de Serviço</h2>

        <select id="cliente">
            <option value="">Selecione o cliente</option>
        </select>
        <select id="tecnico">
            <option value="">Selecione o técnico</option>
        </select>
        <input id="abertura" type="date">
        <input id="status" placeholder="Status">
        <input id="descricao" placeholder="Descrição">

        <button onclick="salvarOrdem()">Salvar</button>
    `;

    carregarClientes(null);
    carregarTecnicos(null);
}

function salvarOrdem() {
    const clienteId = document.getElementById("cliente").value;
    const tecnicoId = document.getElementById("tecnico").value;
    const abertura = document.getElementById("abertura").value;
    const status = document.getElementById("status").value;
    const descricao = document.getElementById("descricao").value;

    fetch(API + "/ordens", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            clienteId,
            tecnicoId,
            abertura,
            status,
            descricao
        })
    })
        .then(async response => {
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Erro ao salvar ordem");
            }
        })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Ordem registrada com sucesso"
            });
            loadOrdens();
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: error.message
            });
        });
}

function editarOrdem(id) {
    fetch(API + "/ordens/" + id, { headers: getHeaders() })
        .then(res => res.json())
        .then(ordem => {
            const clienteId = ordem.clienteId;
            const tecnicoId = ordem.tecnicoId;
            document.getElementById("conteudo").innerHTML = `
                <h2>Editar Ordem</h2>

                <input id="id" type="hidden" value="${ordem.id}">
                <select id="cliente">
                    <option value="">Selecione o cliente</option>
                </select>
                <select id="tecnico">
                    <option value="">Selecione o técnico</option>
                </select>
                <input id="abertura" type="date" value="${ordem.abertura}">
                <input id="status" placeholder="Status" value="${ordem.status}">
                <input id="descricao" placeholder="Descrição" value="${ordem.descricao}">
                <button onclick="atualizarOrdem()">Atualizar</button>
            `;
            carregarClientes(clienteId);
            carregarTecnicos(tecnicoId);
        });
}

function atualizarOrdem() {
    const id = document.getElementById("id").value;
    const clienteId = document.getElementById("cliente").value;
    const tecnicoId = document.getElementById("tecnico").value;
    const abertura = document.getElementById("abertura").value;
    const status = document.getElementById("status").value;
    const descricao = document.getElementById("descricao").value;

    fetch(API + "/ordens", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, clienteId, tecnicoId, abertura, status, descricao })
    }).then(() => loadOrdens());
}

function excluirOrdem(id) {
    fetch(API + "/ordens/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadOrdens());
}

function carregarClientes(id) {
    const select = document.getElementById("cliente");
    fetch(API + "/clientes", { headers: getHeaders() })
        .then(res => res.json())
        .then(lista => {
            lista.forEach(r => {
                const option = document.createElement("option");
                option.value = r.id;
                option.textContent = r.nome;
                select.appendChild(option);
            });
            if (id) {
                select.value = id;
            }
        });
}

function carregarTecnicos(id) {
    const select = document.getElementById("tecnico");
    fetch(API + "/tecnicos", { headers: getHeaders() })
        .then(res => res.json())
        .then(lista => {
            lista.forEach(s => {
                const option = document.createElement("option");
                option.value = s.id;
                option.textContent = s.nome;
                select.appendChild(option);
            });
            if (id) {
                select.value = id;
            }
        });
}

function formatarData(dataISO) {
    if (!dataISO) return "";

    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}