<?php

namespace App\Service;

use PDO;

class PacienteService
{
    private PDO $pdo; 

    public function __construct(PDO $pdo) {

        $this->pdo = $pdo;
    }

    public function criar(array $dados): int
    {

            $sql = "INSERT INTO paciente (id_usuario, nome_paciente,  data_nascimento)
                        VALUES (:id_usuario, :nome_paciente,  :data_nascimento)";

            $stmtPaciente = $this->pdo->prepare($sql);

            $stmtPaciente->bindValue(':id_usuario', $dados['id_usuario'], PDO::PARAM_INT);
            $stmtPaciente->bindValue(':nome_paciente', $dados['nome_paciente'], PDO::PARAM_STR);
            $stmtPaciente->bindValue(':data_nascimento', $dados['data_nascimento'], PDO::PARAM_STR);

            $stmtPaciente->execute();

            return (int) $this->pdo->lastInsertId();   
    }
}