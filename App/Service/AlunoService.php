<?php

namespace App\Service;

use PDO;

class AlunoService
{
    private PDO  $pdo; 

    public function __construct(PDO $pdo) {

        $this->pdo = $pdo;
    }

    public function criar(array $dados): int
    {

            $sql = "INSERT INTO aluno (id_usuario, matricula , semestre )
                VALUES(:id_usuario, :matricula, :semestre )";

            $stmtAluno = $this->pdo->prepare($sql);

            $stmtAluno->bindValue(':id_usuario', $dados['id_usuario'], PDO::PARAM_INT);
            $stmtAluno->bindValue(':matricula', $dados['matricula'], PDO::PARAM_INT);
            $stmtAluno->bindValue(':semestre', $dados['semestre'], PDO::PARAM_INT);

            $stmtAluno->execute();

            return (int) $this->pdo->lastInsertId();

    }
}