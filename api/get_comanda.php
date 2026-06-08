<?php
// api/get_comanda.php
require_once 'conexao.php';

$id = $_GET['id'] ?? 0;

$stmt = $pdo->prepare("
    SELECT 
        i.produto_id, 
        i.quantidade, 
        i.valor_unitario,         -- campo que estava faltando
        i.data_criacao,           -- campo que estava faltando
        p.nome AS nome_produto 
    FROM itens_comanda i
    JOIN produtos p ON i.produto_id = p.id
    WHERE i.comanda_id = ?
");
$stmt->execute([$id]);
$itens = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode(['itens' => $itens]);
?>