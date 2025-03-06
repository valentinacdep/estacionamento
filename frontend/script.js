// cadastro de usuário
const cadastroForm = document.getElementById('cadastroForm');
cadastroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('confirm_senha').value;

    if (password !== confirmPassword) {
        alert("Senha inválida.");
        return;
    }

    const response = await fetch('http://localhost:3030/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
    });

    const result = await response.json();

    if (result.success) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
    } else {
        alert("Erro ao cadastrar usuário.");
    }
});

// login
const form = document.getElementById('formLogin');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      const response = await fetch('http://localhost:3030/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const result = await response.json();

      if (result.success) {
        alert("Login bem-sucedido!");
        window.location.href = "paginicial.html";
      } else {
        alert("Usuário ou senha incorretos!");
      }
});


// Listar carros
function listarCarros() {
    const usuarioId = localStorage.getItem('usuarioId');
    
    fetch(`http://localhost:3030/carros?usuarioId=${usuarioId}`)
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById("lista");
            lista.innerHTML = "";

            if (data.success) {
                data.carros.forEach(carro => {
                    const item = document.createElement("li");
                    item.textContent = `Modelo: ${carro.modelo} | Placa: ${carro.placa} | Cor: ${carro.cor} | Vaga: ${carro.vaga}`;

                    // editar
                    const editarButton = document.createElement("button");
                    editarButton.textContent = "Editar";
                    editarButton.onclick = () => editarCarro(carro.id);

                    // excluir
                    const deletarButton = document.createElement("button");
                    deletarButton.textContent = "Deletar";
                    deletarButton.onclick = () => deletarCarro(carro.id);

                    item.appendChild(editarButton);
                    item.appendChild(deletarButton);
                    lista.appendChild(item);
                });
            } else {
                lista.innerHTML = "<li>Erro ao listar.</li>";
            }
        })
        .catch(() => {
            document.getElementById("lista").innerHTML = "<li>Erro ao conectar com o servidor.</li>";
        });
}

