<?php

namespace App\Controller;

use App\Database\Conexao;

class ProfessorController extends BaseController
{
    public function __construct()
    {
        $this->verificarAutenticacao(3);
    }

    public function index()
    {

        $this->listarSolicitacoes();

    }

    public function listarSolicitacoes()
    {

        try {

            $pdo = Conexao::getConnection();

            $sql = "SELECT solicitacoes_atendimento.id_solicitacao, usuario.nome_user, solicitacoes_atendimento.especialidade, solicitacoes_atendimento.horario_desejado, solicitacoes_atendimento.observacao_inicial, solicitacoes_atendimento.solicitacoes_status FROM  solicitacoes_atendimento
                    INNER JOIN paciente ON solicitacoes_atendimento.id_paciente = paciente.id_paciente
                    INNER JOIN usuario ON usuario.id_user = paciente.id_usuario;";

            $result = $pdo->query($sql);

            $dados = $result->fetchAll(\PDO::FETCH_ASSOC);

            $SolicitacoesPendentes = [];
            $solicitacoesAnalisadas = [];

            foreach ($dados as $dado) {

                switch ($dado['solicitacoes_status']) {
                    case 'AGUARDANDO_TRIAGEM':
                        $SolicitacoesPendentes[] = $dado;
                        break;

                    default:
                        $solicitacoesAnalisadas[] = $dado;
                        break;
                }

            }
            require dirname(__DIR__, 2). '/App/Views/professor/AreaProfessor.php';

        } catch (\Exception $e) {

            error_log("Erro ao carregar as solicitações na tela do professor! ". $e->getMessage());
            echo "Erro ao carregar as solicitações na tela do professor! ". $e->getMessage();

        }

    }

}
