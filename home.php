<?php
// Inicia a leitura das sessões do servidor
session_start();

// Verifica se a "Identidade" do usuário NÃO existe
if (!isset($_SESSION['usuario_id'])) {
    // Se não estiver logado, chuta o usuário de volta para o login
    header("Location: index.html");
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Gestão de Comandas - Home</title>

    <link rel="stylesheet" href="css/style.css">
</head>

<body class="home">
    <header class="nav">

        <img src="assets/logo.png" alt="Logo do SaaS Gestão de Comandas" class="logo-header">

        <nav>
            <ul>
                <li><a href="home.php" class="select-nav">Comandas</a></li>
                <li><a href="produtos.php">Produtos</a></li>
                <li><a href="admin.php">Painel Administrativo</a></li>
            </ul>
        </nav>
    </header>

    <main class="conteudo">
        <div class="title">
            <h2>Comandas</h2>

            <div class="grupo-acoes">
                <div class="search-container">
                    <input type="text" id="buscar-comanda" placeholder="Buscar comandas...">
                    <button class="btn-pesquisar" aria-label="Pesquisar"></button>
                </div>

                <a href="#n-comanda" class="btn-nova-comanda">
                    + Nova Comanda
                </a>
            </div>
        </div>

        <div class="status">
            <ul>
                <li class="btn-filtro active" data-filter="aberta">
                    <span class="status-aberta"></span> Abertas (#)
                </li>
                <li class="btn-filtro" data-filter="arquivada">
                    <span class="status-fechada"></span> Arquivadas (#)
                </li>
                <li class="btn-filtro" data-filter="pendente">
                    <span class="status-pendente"></span> Fechadas (#)
                </li>
            </ul>
        </div>

        <div class="container-comandas">
            <div class="cartao-comanda" data-status="aberta">
                Mesa 04 - Cliente: Carlos
            </div>
            <div class="cartao-comanda" data-status="pendente">
                Mesa 12 - Cliente: Ana (Aguardando Pagamento)
            </div>
            <div class="cartao-comanda" data-status="arquivada">
                Mesa 02 - Cliente: Roberto (Finalizada)
            </div>
            <div class="cartao-comanda" data-status="aberta">
                Mesa 07 - Cliente: Julia
            </div>
        </div>
    </main>

    <!-- TELA SOBREPOSTA DE NOVA COMANDA -->

    <div id="modal-comanda" class="modal-overlay">
        <div class="modal-content">
            <h2>Nova Comanda</h2>
            <form id="form-nova-comanda">
                <input type="text" placeholder="Nome do Cliente" required>
                <input type="number" placeholder="Número da Mesa" required>
                <div class="modal-actions">
                    <button type="button" onclick="fecharModal()">Cancelar</button>
                    <button type="submit">Salvar Comanda</button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/script.js" defer></script>
</body>

</html>