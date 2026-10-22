<?php

namespace App\Controller;

class BaseController
{
    protected function verificarAutenticacao($papelPermitido): void
    {
        // A sessão deve ser iniciada pelo front controller (index.php).
        if (session_status() !== PHP_SESSION_ACTIVE) {
            error_log(
                'Acolhe: sessão não inicializada antes da verificação de autenticação.'
            );

            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');

            echo json_encode([
                'erro' => 'Erro interno ao verificar a autenticação.'
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }

        // Usuário não autenticado.
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');

            echo json_encode([
                'erro' => 'Usuário não autenticado.'
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }

        // Usuário autenticado, mas sem permissão para acessar o recurso.
        if (
            !isset($_SESSION['user_papel']) ||
            (int) $_SESSION['user_papel'] !== (int) $papelPermitido
        ) {
            http_response_code(403);
            header('Content-Type: application/json; charset=utf-8');

            echo json_encode([
                'erro' => 'Acesso negado.'
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }
    }
}
