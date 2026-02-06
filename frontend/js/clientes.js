function loadClientes() {
    ativarMenu("clientes");
    fetch(API + "/clientes", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {
            let html = `
                <div class="div-header-container">
                    <h2>Clientes</h2>
                    <button onclick="formNovoCliente()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display:none;">ID</th>
                        <th class="col-acoes"></th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                    </tr>
            `;

            data.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td class="col-acoes">
                            <button onclick="editarCliente(${b.id})">Editar</button>
                            <button onclick="excluirCliente(${b.id})">Excluir</button>
                        </td>
                        <td>${b.nome}</td>
                        <td>${b.telefone}</td>
                        <td>${b.email}</td>
                    </tr>
                `;
            });

            html += "</table>";
            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoCliente() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Novo Cliente</h2>

        <input id="nome" type="text" placeholder="Nome">
        <input id="telefone" type="text" placeholder="Telefone">
        <input id="email" placeholder="Email">

        <button onclick="salvarCliente()">Salvar</button>
    `;
}

function salvarCliente() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

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
                <h2>Editar Cliente</h2>

                <input id="id" type="hidden" value="${cliente.id}">
                <input id="nome" type="text" value="${cliente.nome}">
                <input id="telefone" type="text" value="${cliente.telefone}">
                <input id="email" type="text" value="${cliente.email}">
                <button onclick="atualizarCliente()">Atualizar</button>
            `;
        });
}

function atualizarCliente() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

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