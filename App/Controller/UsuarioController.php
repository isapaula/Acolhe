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

        try {

            $pdo = Conexao::getConnection();

            $login = $_POST['user'] ?? null;
            $pass = $_POST['pass'] ?? null;

            $sql = "SELECT id_user, nome_user, email_user, senha_user, id_papel FROM usuario WHERE email_user = ? ;";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([$login]);

            $usuario = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($usuario && password_verify($pass, $usuario['senha_user'])) {

                $_SESSION['user_id']    = $usuario['id_user'];
                $_SESSION['user_nome']  = $usuario['nome_user'];
                $_SESSION['user_papel'] = $usuario['id_papel'];

            switch ($usuario['id_papel']) {

                case 1:
                    header('Location: /paciente/index');
                    break;

                case 2:
                    header('Location: /aluno/index');
                    break;

                case 3:
                    header('Location: /professor/index');
                    break;

                default:
                    header('Location: /usuario/login');
                    break;
                }

                exit;

            } else {
                echo "E-mail ou senha inválidos!";
            }

        } catch (\Exception $e) {

            error_log("Erro ao logar no sistema: ". $e->getMessage());

            echo "Erro ao logar no sistema: ".$e->getMessage();

        }

    }

}
