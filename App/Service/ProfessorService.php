<?php

namespace App\Service;

class ProfessorService
{

    private $pdo; 

    public function __construct($pdo) {

        $this->pdo = $pdo;
    }

    public function criar($dados)
    {


            $sql = "INSERT INTO professor (id_usuario, registro_profissional)
                VALUES (:id_usuario, :registro_profissional)";

            $stmtprofessor = $this->pdo->prepare($sql);

            $stmtprofessor->bindValue(':id_usuario', $dados['id_usuario'], \PDO::PARAM_STR);
            $stmtprofessor->bindValue(':registro_profissional', $dados['registro_profissional'], \PDO::PARAM_STR);

            $stmtprofessor->execute();

            $idprofessor = $this->pdo->lastInsertId();

            $_SESSION['professor_id'] = $idprofessor;


    }
}
