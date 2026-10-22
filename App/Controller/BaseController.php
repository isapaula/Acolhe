<?php

namespace App\Controller;

use App\Controller\HomeController;

class BaseController
{
    protected function verificarAutenticacao($papelPermitido)
    {

        if (session_status() === PHP_SESSION_NONE) {
            // nesse caso a sessão foi perdida ou não foi criada no front controller, para esse sistema a sessão sempre deve ser criada nao front controller;
            // caso isso não aconteça então volta para home, pois é importantíssimo que o front controller inicie a sessão;
            $home = new HomeController();
            $home->index();

        }

        if (!isset($_SESSION['user_id'])) {
            header("Location: /");
            exit;
        }

        if ($_SESSION['user_papel'] != $papelPermitido) {
            echo "Acesso negado";
            exit;
        }

    }

}
