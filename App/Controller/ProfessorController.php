<?php

namespace App\Controller;

class ProfessorController extends BaseController
{
    public function __construct()
    {
        $this->verificarAutenticacao(3);
    }

}
