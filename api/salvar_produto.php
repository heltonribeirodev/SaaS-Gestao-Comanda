<?php
session_start();
require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Recebe os dados
    $nome = $_POST['nome'] ?? '';
    $valor = $_POST['valor'] ?? '0';
    $categoria = $_POST['categoria'] ?? '';

    // 2. Salva no banco (apenas dados de texto)
    try {
        // SQL removendo a coluna 'imagem'
        $stmt = $pdo->prepare("INSERT INTO produtos (nome, valor, categoria) VALUES (?, ?, ?)");
        $stmt->execute([$nome, $valor, $categoria]);
        
        // Redireciona com sucesso
        header("Location: ../produtos.php?status=sucesso");
        exit;
        
    } catch (PDOException $e) {
        // Se der erro, redireciona para a página de produtos com erro
        header("Location: ../produtos.php?status=erro");
        exit;
    }
}
?>