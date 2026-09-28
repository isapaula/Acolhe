<?php

namespace App\Service;


class PacienteService
{

    private $pdo; 

    public function __construct($pdo) {

        $this->pdo = $pdo;
    }

    public function criar($dados)
    {

        try {

            $sql = "INSERT INTO paciente (id_usuario, nome_paciente,  data_nascimento, telefone)
                        VALUES (:id_usuario, :nome_paciente,  :data_nascimento, :telefone)";

            $stmtPaciente = $this->pdo->prepare($sql);

            $stmtPaciente->bindValue(':id_usuario', $dados['id_usuario'], \PDO::PARAM_STR);
            $stmtPaciente->bindValue(':nome_paciente', $dados['nome_paciente'], \PDO::PARAM_STR);
            $stmtPaciente->bindValue(':data_nascimento', $dados['data_nascimento'], \PDO::PARAM_STR);
            $stmtPaciente->bindValue(':telefone', $dados['telefone'], \PDO::PARAM_STR);

            $stmtPaciente->execute();

            $idPaciente = $this->pdo->lastInsertId();
            

            $_SESSION['paciente_id'] = $idPaciente;


        } catch (\Exception $e) {

            echo "Não foi possível cadastrar o paciente! ".$e->getMessage();

        }

    }

}
