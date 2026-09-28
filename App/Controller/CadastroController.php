<?php

namespace App\Controller;

class CadastroController {

    public function paciente (){

        require dirname(__DIR__, 2). '/App/Views/paciente/PacienteForm.php';
    }

    public function aluno (){

        require dirname(__DIR__, 2). '/App/Views/Aluno/FormAluno.php';
    }

    public function professor(){

        require dirname(__DIR__, 2). '/App/Views/professor/formProfessor.php';
    }

}