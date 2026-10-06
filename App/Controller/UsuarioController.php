<?php

namespace App\Controller;

use App\Database\Conexao;

class UsuarioController
{
    public function login()
    {

        require dirname(__DIR__, 2). '/App/Views/Login.php';
    }

    public function store()
    {

        $dados = json_decode(file_get_contents('php://input'), true);

        try {

            $pdo = Conexao::getConnection();

            $login = $dados['email'] ?? null;
            $pass = $dados['senha'] ?? null;

            if (empty($login) || empty($pass)) {
                http_response_code(400);
                header('Content-Type: application/json');

                echo json_encode([
                    'erro' => 'E-mail e senha são obrigatórios'
                ]);

                return;
            }


            $sql = "SELECT id_user, nome_user, email_user, senha_user, id_papel FROM usuario WHERE email_user = ? ;";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([$login]);

            $usuario = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$usuario || !password_verify($pass, $usuario['senha_user'])) {
                http_response_code(401);
                header('Content-Type: application/json');

                echo json_encode([
                    'erro' => 'E-mail ou senha inválidos'
                ]);

                return;
            }

            $_SESSION['user_id'] = $usuario['id_user'];
            $_SESSION['user_nome'] = $usuario['nome_user'];
            $_SESSION['user_papel'] = $usuario['id_papel'];

            http_response_code(200);
            header('Content-Type: application/json');

            echo json_encode([
                'mensagem' => 'Login realizado com sucesso',
                'usuario' => [
                    'id' => $usuario['id_user'],
                    'nome' => $usuario['nome_user'],
                    'email' => $usuario['email_user'],
                    'papel' => $usuario['id_papel']
                ]
            ]);

        
        } catch (\Exception $e) {

             error_log("Erro ao logar no sistema: " . $e->getMessage());

            http_response_code(500);
            header('Content-Type: application/json');

            echo json_encode([
                'erro' => 'Erro interno ao realizar login'
            ]);

        }

    }

}
