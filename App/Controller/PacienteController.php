<?php

namespace App\Controller;

class PacienteController extends BaseController
{
    public function __construct()
    {
        $this->verificarAutenticacao(1);
    }


}
