<?php

namespace App\Service;

use PDO;

class ProfessorService
{
    private PDO $pdo; 

    public function __construct(PDO $pdo) {

        $this->pdo = $pdo;
    }

    public function criar(array $dados): int
    {

            $sql = "INSERT INTO professor (id_usuario, registro_profissional)
                VALUES (:id_usuario, :registro_profissional)";

            $stmtProfessor = $this->pdo->prepare($sql);

            $stmtProfessor->bindValue(':id_usuario', $dados['id_usuario'], PDO::PARAM_INT);
            $stmtProfessor->bindValue(':registro_profissional', $dados['registro_profissional'], PDO::PARAM_STR);

            $stmtProfessor->execute();

            return (int) $this->pdo->lastInsertId();
    }
}
