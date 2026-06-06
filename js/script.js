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

// Função isolada para processar a exibição
function aplicarFiltro(filtro) {
    listaComandas.forEach(comanda => {
        const statusComanda = comanda.getAttribute('data-status');

        // Agora verifica apenas se o filtro do botão bate exatamente com o status do cartão
        if (filtro === statusComanda) {
            comanda.style.display = 'block'; // Nota: Mude para 'flex' se usar flexbox nos cartões
        } else {
            comanda.style.display = 'none';
        }
    });
}

// Evento de clique para alternar as abas
botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('active'));
        botao.classList.add('active');

        const filtroSelecionado = botao.getAttribute('data-filter');
        aplicarFiltro(filtroSelecionado);
    });
});

// Inicialização de segurança: 
// Executa o filtro logo que a página carrega, baseando-se no <li> que já tem a classe 'active'
const botaoAtivoInicial = document.querySelector('.btn-filtro.active');
if (botaoAtivoInicial) {
    aplicarFiltro(botaoAtivoInicial.getAttribute('data-filter'));
}