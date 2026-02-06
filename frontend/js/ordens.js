function loadOrdens() {
    ativarMenu("ordens");
    fetch(API + "/ordens", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {
            let html = `
                <div class="div-header-container">
                    <h2>Ordens de Serviço</h2>
                    <button class="btn-novo" onclick="formNovoOrdem()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display:none;">ID</th>
                        <th></th>
                        <th>Cliente</th>
                        <th>Técnico</th>
                        <th>Abertura</th>
                        <th>Descrição</th>
                        <th class="col-acoes"></th>
                    </tr>
            `;

            data.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td style="width: 0px; padding-right: 100px;"><span class="status ${b.status}">${b.status === "EM_ANDAMENTO" ? "ANDAMENTO" : b.status}</span></td>
                        <td>${b.clienteNome}</td>
                        <td>${b.tecnicoNome}</td>
                        <td>${formatarData(b.abertura)}</td>
                        <td>${b.descricao}</td>
                        <td class="col-acoes-custom">
                        <button 
                            onclick="iniciarOrdem(${b.id})"
                            class="icon-btn iniciar"
                            ${b.status !== "ABERTA" ? "disabled" : ""}
                            title="Iniciar"
                        >
                            <i class="fa fa-play"></i>
                        </button>

                        <button 
                            onclick="finalizarOrdem(${b.id})"
                            class="icon-btn finalizar"
                            ${b.status !== "EM_ANDAMENTO" ? "disabled" : ""}
                            title="Finalizar"
                        >
                            <i class="fa fa-check"></i>
                        </button>

                        <div class="menu-acoes">
                            <button class="icon-btn menu-btn" onclick="toggleMenu(this)" style="">
                                <i class="fa fa-ellipsis-v"></i>
                            </button>

                            <div class="menu-dropdown">
                                <button style="color: #999;"
                                    onclick="editarOrdem(${b.id})"
                                    ${b.status === "CANCELADA" || b.status === "FINALIZADA" ? "disabled" : ""}
                                >
                                    <i class="fa fa-edit"></i> Editar
                                </button>

                                <button style="color: #999;"
                                    onclick="cancelarOrdem(${b.id})"
                                    ${b.status !== "EM_ANDAMENTO" ? "disabled" : ""}
                                >
                                    <i class="fa fa-ban"></i> Cancelar
                                </button>

                                <button style="color: #999;"
                                    onclick="excluirOrdem(${b.id})"
                                >
                                    <i class="fa fa-trash"></i> Excluir
                                </button>
                            </div>
                        </div>
                    </td>
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

            <div class="form-grid">
                <div class="form-group">
                    <label>Cliente</label>
                    <select id="cliente">
                        <option value="">Selecione o cliente</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Técnico</label>
                    <select id="tecnico">
                        <option value="">Selecione o técnico</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Data de abertura</label>
                    <input id="abertura" type="date">
                </div>

                <div class="form-group full">
                    <label>Descrição</label>
                    <textarea id="descricao" rows="4"
                        placeholder="Descreva o problema ou serviço"></textarea>
                </div>
            </div>

            <div class="form-actions">
                <button class="btn-primary" onclick="salvarOrdem()">Salvar</button>
                <button class="btn-secondary" onclick="loadOrdens()">Cancelar</button>
            </div>
        
    `;

    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("abertura").value = hoje;

    carregarClientes();
    carregarTecnicos();
}

function salvarOrdem() {
    const clienteId = document.getElementById("cliente").value;
    const tecnicoId = document.getElementById("tecnico").value;
    const abertura = document.getElementById("abertura").value;
    const descricao = document.getElementById("descricao").value;

    fetch(API + "/ordens", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            clienteId,
            tecnicoId,
            abertura,
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
                <input id="abertura" type="date" value="${ordem.abertura}" disabled>
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
    const descricao = document.getElementById("descricao").value;

    fetch(API + "/ordens", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, clienteId, tecnicoId, descricao })
    }).then(() => loadOrdens());
}

function excluirOrdem(id) {
    fetch(API + "/ordens/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadOrdens());
}

function iniciarOrdem(id) {
    Swal.fire({
        title: "Deseja realmente iniciar a ordem de serviço?",
        text: "A partir deste momento a ordem de serviço será iniciada e contabilizada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, iniciar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            fetch(API + "/ordens/" + id + "/iniciar", {
                method: "POST",
                headers: getHeaders()
            }).then(() => {
                Swal.fire("Pronto!", "A ordem de serviço foi iniciada!", "success");
                loadOrdens();
            });
        }
    });
}

function finalizarOrdem(id) {
    Swal.fire({
        title: "Deseja realmente finalizar a ordem de serviço?",
        text: "A partir deste momento a ordem de serviço será finalizada e não poderá mais ser cancelada ou editada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, finalizar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            fetch(API + "/ordens/" + id + "/finalizar", {
                method: "POST",
                headers: getHeaders()
            }).then(() => {
                Swal.fire("Pronto!", "A ordem de serviço foi finalizada!", "success");
                loadOrdens();
            });
        }
    });
}

function cancelarOrdem(id) {
    Swal.fire({
        title: "Deseja realmente cancelar a ordem de serviço?",
        text: "A ordem de serviço será cancelada deixando-a inutizilável.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, cancelar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            fetch(API + "/ordens/" + id + "/cancelar", {
                method: "POST",
                headers: getHeaders()
            }).then(() => {
                Swal.fire("Pronto!", "A ordem de serviço foi cancelada!", "success");
                loadOrdens();
            });
        }
    });
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