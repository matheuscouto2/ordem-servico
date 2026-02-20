function loadClientes(pagina = 1) {
    ativarMenu("clientes");
    fetch(API + "/clientes", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {


            const itensPorPagina = 15;
            const totalPaginas = Math.ceil(data.length / itensPorPagina);
            const inicio = (pagina - 1) * itensPorPagina;
            const fim = inicio + itensPorPagina;
            const dadosPaginados = data.slice(inicio, fim);

            let html = `
                <div class="div-header-container">
                    <h2>Clientes</h2>
                    <button class="btn-novo" onclick="formNovoCliente()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display:none;">ID</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th class="col-acoes"></th>
                    </tr>
            `;

            dadosPaginados.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td>${b.nome}</td>
                        <td>${b.telefone}</td>
                        <td>${b.email}</td>
                        <td class="col-acoes">
                            <button onclick="editarCliente(${b.id})" class="icon-btn edit"><i class="fa fa-edit"></i></button>
                            <button onclick="excluirCliente(${b.id})" class="icon-btn delete"><i class="fa fa-times"></i></button>
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
                        onclick="loadClientes(${i})" 
                        class="${i === pagina ? "active-page" : ""}">
                        ${i}
                    </button>
                `;
            }

            html += `</div>`;

            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoCliente() {
    document.getElementById("conteudo").innerHTML = `
        <div class="form-container">
            <h2>Vamos criar algo novo?</h2>

            <div class="form-grid">
                <div class="form-group">
                    <label>Nome</label>
                    <input id="nome" type="text" placeholder="Digite o nome">
                </div>

                <div class="form-group">
                    <label>Telefone</label>
                    <input id="telefone" type="text" placeholder="Digite o telefone">
                </div>

                <div class="form-group full">
                    <label>Email</label>
                    <input id="email" type="email" placeholder="Digite o email">
                </div>
            </div>

            <div class="form-actions">
                <button class="btn-secondary" onclick="loadClientes()">Cancelar</button>
                <button class="btn-primary" onclick="salvarCliente()">Salvar</button>
            </div>
        </div>
    `;
}

function salvarCliente() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    if (!nome || !telefone || !email) {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Todos os campos são obrigatórios"
        });
        return;
    }

    fetch(API + "/clientes", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            nome,
            telefone,
            email
        })
    })
        .then(async response => {
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Erro ao salvar cliente");
            }
        })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Cliente registrado com sucesso"
            });
            loadClientes();
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: error.message
            });
        });
}

function editarCliente(id) {
    fetch(API + "/clientes/" + id, { headers: getHeaders() })
        .then(res => res.json())
        .then(cliente => {
            document.getElementById("conteudo").innerHTML = `
                <div class="form-container">
                    <h2>Hora de mexer nos detalhes...</h2>

                    <input id="id" type="hidden" value="${cliente.id}">

                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nome</label>
                            <input id="nome" type="text" value="${cliente.nome}" placeholder="Digite o nome">
                        </div>

                        <div class="form-group">
                            <label>Telefone</label>
                            <input id="telefone" type="text" value="${cliente.telefone}" placeholder="Digite o telefone">
                        </div>

                        <div class="form-group full">
                            <label>Email</label>
                            <input id="email" type="email" value="${cliente.email}" placeholder="Digite o email">
                        </div>
                    </div>

                    <div class="form-actions">
                        <button class="btn-secondary" onclick="loadClientes()">Cancelar</button>
                        <button class="btn-primary" onclick="atualizarCliente()">Atualizar</button>
                    </div>
                </div>
            `;
        });
}

function atualizarCliente() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    if (!nome || !telefone || !email) {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Todos os campos são obrigatórios"
        });
        return;
    }

    fetch(API + "/clientes", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, nome, telefone, email })
    }).then(() => loadClientes());
}

function excluirCliente(id) {
    fetch(API + "/clientes/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadClientes());
}