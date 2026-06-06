document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = document.getElementById('btn-entrar');
            btn.innerText = "Entrando...";
            btn.disabled = true;

            const formData = new FormData(this);

            fetch('api/login.php', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) throw new Error("Erro na rede: " + response.status);
                    return response.json();
                })
                .then(data => {
                    console.log("Resposta do servidor:", data);

                    if (data.status === 'sucesso') {
                        window.location.href = 'home.php';
                        // Nota: Não resetamos o botão aqui pois a página mudará
                    } else {
                        const divAlerta = document.getElementById('mensagem-alerta');
                        if (divAlerta) {
                            divAlerta.innerText = data.mensagem;
                            divAlerta.classList.remove('alerta-oculto');
                            divAlerta.classList.add('alerta-ativo');

                            setTimeout(() => {
                                divAlerta.classList.remove('alerta-ativo');
                                divAlerta.classList.add('alerta-oculto');
                            }, 5000);
                        }
                    }
                })
                .catch(err => {
                    console.error("Erro capturado:", err);
                    alert("Erro ao conectar no servidor. Veja o console.");
                })
                .finally(() => {
                    // ESTA É A MÁGICA: O botão reseta sempre, não importa o resultado
                    btn.innerText = "Entrar";
                    btn.disabled = false;
                });
        });
    }
});

// HOME / COMANDAS

const botoesFiltro = document.querySelectorAll('.btn-filtro');
const listaComandas = document.querySelectorAll('.cartao-comanda');

function aplicarFiltro(filtro) {
    listaComandas.forEach(comanda => {
        const statusComanda = comanda.getAttribute('data-status');

        if (filtro === statusComanda) {
            comanda.style.display = 'block'; // Nota: Mude para 'flex' se usar flexbox nos cartões
        } else {
            comanda.style.display = 'none';
        }
    });
}

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('active'));
        botao.classList.add('active');

        const filtroSelecionado = botao.getAttribute('data-filter');
        aplicarFiltro(filtroSelecionado);
    });
});

const botaoAtivoInicial = document.querySelector('.btn-filtro.active');
if (botaoAtivoInicial) {
    aplicarFiltro(botaoAtivoInicial.getAttribute('data-filter'));
}

// FUNÇÃO PARA ABRIR E FECHAR A TELA SOBREPOSTA DE NOVA COMANDA
function abrirModal() {
    document.getElementById('modal-comanda').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-comanda').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    // Ajuste o seletor se o seu botão for diferente
    const btnNovaComanda = document.querySelector('.btn-nova-comanda');

    if (btnNovaComanda) {
        btnNovaComanda.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal();
        });
    }
});

function proximoPasso() {
    const inputNome = document.getElementById('cliente');
    const erroDiv = document.getElementById('erro-cliente');

    // Validação: trim() remove espaços em branco antes/depois
    if (inputNome.value.trim() === "") {
        erroDiv.innerText = "Por favor, preencha o nome do cliente.";
        erroDiv.style.display = "block"; // Mostra o balão
        inputNome.focus(); // Coloca o cursor no campo
        return; // Interrompe a função aqui
    }

    // Se passou na validação, esconde o erro e muda a tela
    erroDiv.style.display = "none";
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function voltarPasso() {
    // Esconde qualquer erro remanescente ao voltar
    document.getElementById('erro-cliente').style.display = 'none';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-1').style.display = 'block';
}

function fecharModal() {
    // Esconde o modal
    document.getElementById('modal-comanda').style.display = 'none';

    // Reseta o estado para o passo 1
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';

    // Esconde o balão de erro caso ele estivesse visível
    document.getElementById('erro-cliente').style.display = 'none';

    // Reseta o formulário
    document.getElementById('form-nova-comanda').reset();
}

// NOVO PRODUTO
function abrirModalProduto() {
    document.getElementById('modal-novo-produto').classList.add('visivel');
}

function fecharModalProduto() {
    document.getElementById('modal-novo-produto').classList.remove('visivel');
}


document.addEventListener('DOMContentLoaded', () => {
    const msgStatus = document.getElementById('msg-status');

    // Verifica se a URL tem o parâmetro 'status'
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('status')) {
        msgStatus.style.display = 'block'; // Mostra a mensagem

        // Remove o parâmetro da URL para não mostrar a mensagem ao recarregar a página
        window.history.replaceState({}, document.title, window.location.pathname);

        // Esconde após 3 segundos
        setTimeout(() => {
            msgStatus.style.display = 'none';
        }, 3000);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const cardsProdutos = document.querySelectorAll('.card-produto');

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            // 1. Remove a classe 'active' de todos os botões e adiciona no clicado
            botoesFiltro.forEach(b => b.classList.remove('active'));
            botao.classList.add('active');

            // 2. Pega a categoria selecionada
            const categoriaSelecionada = botao.getAttribute('data-filter');

            // 3. Filtra os cards
            cardsProdutos.forEach(card => {
                const categoriaCard = card.getAttribute('data-categoria');

                if (categoriaSelecionada === 'todos' || categoriaCard === categoriaSelecionada) {
                    card.style.display = 'block'; // Mostra o card
                } else {
                    card.style.display = 'none'; // Esconde o card
                }
            });
        });
    });
});

// Função de busca
function realizarBusca() {
    const termo = document.getElementById('buscar-produto').value.toLowerCase();
    const cards = document.querySelectorAll('.card-produto');
    const botoesFiltro = document.querySelectorAll('.btn-filtro');

    // 1. Filtra os produtos
    cards.forEach(card => {
        const nomeProduto = card.querySelector('p strong').textContent.toLowerCase();
        if (nomeProduto.includes(termo)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // 2. Atualiza a contagem de cada categoria
    botoesFiltro.forEach(botao => {
        const categoria = botao.getAttribute('data-filter');

        if (categoria === 'todos') {
            const visiveis = Array.from(cards).filter(c => c.style.display !== 'none').length;
            botao.innerHTML = `Todos (${visiveis})`;
        } else {
            // Conta apenas os cards visíveis que pertencem a esta categoria
            const visiveis = Array.from(cards).filter(c =>
                c.style.display !== 'none' && c.getAttribute('data-categoria') === categoria
            ).length;

            // Atualiza o texto (mantendo o nome da categoria)
            botao.innerHTML = `${categoria} (${visiveis})`;
        }
    });
}

// Vincula o evento 'input'
document.getElementById('buscar-produto').addEventListener('input', realizarBusca);

// O EVENTO 'input' detecta cada tecla digitada ou apagada
document.getElementById('buscar-produto').addEventListener('input', realizarBusca);

// Opcional: Manter o botão funcionando caso o usuário prefira clicar
document.querySelector('.btn-pesquisar').addEventListener('click', realizarBusca);


function excluirProduto(id) {
    // SEM o confirm, ele executa direto
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/saas-gestao-comandas/api/acoes_produto.php';
    
    const inputAcao = document.createElement('input');
    inputAcao.type = 'hidden';
    inputAcao.name = 'acao';
    inputAcao.value = 'excluir';
    
    const inputId = document.createElement('input');
    inputId.type = 'hidden';
    inputId.name = 'id';
    inputId.value = id;
    
    form.appendChild(inputAcao);
    form.appendChild(inputId);
    document.body.appendChild(form);
    form.submit();
}

let idParaExcluir = null;

function excluirProduto(id) {
    idParaExcluir = id;
    document.getElementById('modal-confirmacao').style.display = 'flex';
}

function fecharConfirmacao() {
    document.getElementById('modal-confirmacao').style.display = 'none';
}

// Ao clicar no botão dentro do modal
document.getElementById('btn-confirmar-exclusao').addEventListener('click', () => {
    if (idParaExcluir) {
        window.location.href = 'api/acoes_produto.php?acao=excluir&id=' + idParaExcluir;
    }
});

function editarProduto(id) {
    fetch(`api/get_produto.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            const modal = document.getElementById('modal-novo-produto');
            const form = modal.querySelector('form');
            
            // 1. Muda o título
            modal.querySelector('h2').innerText = 'Editar Produto';
            
            // 2. Garante que o action esteja apontando para o arquivo base
            // Não precisamos mais do ?id=${id} na URL aqui
            form.action = 'api/salvar_produto.php';
            
            // 3. Preenche o campo oculto (ID) que criamos no HTML
            const inputId = form.querySelector('input[name="id"]');
            if (inputId) {
                inputId.value = id;
            }
            
            // 4. Preenche os campos de texto
            form.querySelector('input[name="nome"]').value = data.nome;
            form.querySelector('input[name="valor"]').value = data.valor;
            form.querySelector('input[name="categoria"]').value = data.categoria;
            
            // 5. Abre o modal
            modal.style.display = 'flex';
        });
}

function abrirModalProduto() {
    document.getElementById('modal-novo-produto').style.display = 'flex';
    // Reseta o título e o action para modo "Novo"
    document.querySelector('#modal-novo-produto h2').innerText = 'Novo Produto';
    document.querySelector('#modal-novo-produto form').action = 'api/salvar_produto.php';
    document.querySelector('#modal-novo-produto form').reset();
}

function fecharModalProduto() {
    document.getElementById('modal-novo-produto').style.display = 'none';
}