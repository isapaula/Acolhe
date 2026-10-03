<?php

namespace App\Service;

class AlunoService
{
    private $pdo; 

    public function __construct($pdo) {

        $this->pdo = $pdo;
    }

    public function criar($dados)
    {

            $sql = "INSERT INTO aluno (id_usuario, matricula , semestre )
                VALUES(:id_usuario, :matricula, :semestre )";

            $stmtAluno = $this->pdo->prepare($sql);

            $stmtAluno->bindValue(':id_usuario', $dados['id_usuario'], \PDO::PARAM_STR);
            $stmtAluno->bindValue(':matricula', $dados['matricula'], \PDO::PARAM_STR);
            $stmtAluno->bindValue(':semestre', $dados['semestre'], \PDO::PARAM_STR);

            $stmtAluno->execute();

            $idAluno = $this->pdo->lastInsertId();

            $_SESSION['Aluno_id'] = $idAluno;

    }

}
