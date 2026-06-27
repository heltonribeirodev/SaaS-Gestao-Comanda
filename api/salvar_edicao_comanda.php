<?php
// api/salvar_edicao_comanda.php
require_once 'conexao.php';

$comanda_id = $_POST['comanda_id'] ?? 0;

if (!$comanda_id) {
    header('Location: ../home.php?status=erro');
    exit;
}

$pdo->beginTransaction();

try {
    // 1. Busca os itens que JÁ ESTÃO na comanda para comparação
    $stmtAtuais = $pdo->prepare("SELECT id, produto_id, quantidade, valor_unitario FROM itens_comanda WHERE comanda_id = ?");
    $stmtAtuais->execute([$comanda_id]);
    
    $itensExistentes = [];
    foreach ($stmtAtuais->fetchAll(PDO::FETCH_ASSOC) as $item) {
        $itensExistentes[$item['produto_id']] = $item;
    }

    // 2. Busca os preços atuais dos produtos (apenas para NOVAS inserções)
    $stmtProdutos = $pdo->query("SELECT id, valor FROM produtos");
    $precosAtuais = [];
    foreach ($stmtProdutos->fetchAll(PDO::FETCH_ASSOC) as $p) {
        $precosAtuais[$p['id']] = $p['valor'];
    }

    // Prepara os statements fora do loop para otimização de performance
    $stmtUpdate = $pdo->prepare("UPDATE itens_comanda SET quantidade = ? WHERE id = ?");
    $stmtInsert = $pdo->prepare("INSERT INTO itens_comanda (comanda_id, produto_id, quantidade, valor_unitario) VALUES (?, ?, ?, ?)");
    $stmtDelete = $pdo->prepare("DELETE FROM itens_comanda WHERE id = ?");

    // 3. Processa os dados enviados via POST
    $produtosProcessados = []; // Mantém rastro do que veio no POST

    foreach ($_POST as $campo => $valor) {
        if (strpos($campo, 'qtd-') === 0) {
            $produto_id = (int) str_replace('qtd-', '', $campo);
            $quantidade = (int) $valor;
            $produtosProcessados[] = $produto_id;

            if (isset($itensExistentes[$produto_id])) {
                // O item já existe na comanda
                $idItemComanda = $itensExistentes[$produto_id]['id'];
                
                if ($quantidade > 0) {
                    // Se a quantidade mudou, faz o UPDATE. A data e o preço original são mantidos intactos.
                    if ($quantidade !== (int)$itensExistentes[$produto_id]['quantidade']) {
                        $stmtUpdate->execute([$quantidade, $idItemComanda]);
                    }
                } else {
                    // Se a quantidade veio zerada, remove o item
                    $stmtDelete->execute([$idItemComanda]);
                }
            } else {
                // O item NÃO existe na comanda e foi adicionado agora
                if ($quantidade > 0 && isset($precosAtuais[$produto_id])) {
                    $stmtInsert->execute([
                        $comanda_id,
                        $produto_id,
                        $quantidade,
                        $precosAtuais[$produto_id]
                    ]);
                }
            }
        }
    }

    // 4. (Opcional) Limpeza de itens que estavam no banco, mas sequer vieram no POST
    foreach ($itensExistentes as $prod_id => $dadosItem) {
        if (!in_array($prod_id, $produtosProcessados)) {
            $stmtDelete->execute([$dadosItem['id']]);
        }
    }

    $pdo->commit();
    header('Location: ../home.php?status=sucesso');

} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Erro ao salvar comanda: " . $e->getMessage()); // Prática recomendada para debug em produção
    header('Location: ../home.php?status=erro');
}
exit;
?>