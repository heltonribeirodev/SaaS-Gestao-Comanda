<?php
// api/salvar_edicao_comanda.php
require_once 'conexao.php';

$comanda_id = $_POST['comanda_id'] ?? 0;

if (!$comanda_id) {
    header('Location: ../home.php?status=erro');
    exit;
}

// Busca o valor unitário de cada produto no banco para garantir
// que o preço salvo é sempre o preço atual do produto,
// e não um valor que poderia vir manipulado pelo cliente.
$stmtProdutos = $pdo->query("SELECT id, valor FROM produtos");
$precos = [];
foreach ($stmtProdutos->fetchAll(PDO::FETCH_ASSOC) as $p) {
    $precos[$p['id']] = $p['valor'];
}

// Inicia uma transação para garantir que ou tudo salva, ou nada salva.
// Isso evita que a comanda fique em estado inconsistente se ocorrer
// um erro no meio do processo.
$pdo->beginTransaction();

try {
    // Estratégia: apaga todos os itens atuais da comanda e
    // reinsere apenas os que têm quantidade > 0.
    // Mais simples do que comparar item por item.
    $stmtDel = $pdo->prepare("DELETE FROM itens_comanda WHERE comanda_id = ?");
    $stmtDel->execute([$comanda_id]);

    // Prepara o INSERT uma vez e reutiliza dentro do loop (mais eficiente)
    $stmtIns = $pdo->prepare("
        INSERT INTO itens_comanda (comanda_id, produto_id, quantidade, valor_unitario)
        VALUES (?, ?, ?, ?)
    ");

    // Percorre todos os campos do POST procurando os que começam com "qtd-"
    foreach ($_POST as $campo => $valor) {
        if (strpos($campo, 'qtd-') === 0) {
            $produto_id = (int) str_replace('qtd-', '', $campo);
            $quantidade = (int) $valor;

            // Só insere se a quantidade for maior que zero
            // e se o produto realmente existir no banco (segurança extra)
            if ($quantidade > 0 && isset($precos[$produto_id])) {
                $stmtIns->execute([
                    $comanda_id,
                    $produto_id,
                    $quantidade,
                    $precos[$produto_id] // preço sempre vem do banco, nunca do POST
                ]);
            }
        }
    }

    $pdo->commit();
    header('Location: ../home.php?status=sucesso');

} catch (Exception $e) {
    // Se qualquer coisa falhar, desfaz tudo para não corromper os dados
    $pdo->rollBack();
    header('Location: ../home.php?status=erro');
}
exit;
?>