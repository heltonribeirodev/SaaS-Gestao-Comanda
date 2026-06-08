<?php
// api/get_produtos.php
require_once 'conexao.php';

$stmt = $pdo->query("SELECT id, nome, valor, categoria, imagem FROM produtos ORDER BY categoria, nome");
$produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode(['produtos' => $produtos]);
?>