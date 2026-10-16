<?php

namespace App\Controller;

use App\Database\Conexao;
use App\Controller\SessaoController;

class AlunoController extends BaseController
{
    public function __construct()
    {

        $this->verificarAutenticacao(2);
    }

    public function index()
    {

        $this->casosDisponiveis();
    }

    
    public function casosDisponiveis()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);

            echo json_encode([
                'erro' => 'Usuário não autenticado.'
            ], JSON_UNESCAPED_UNICODE);

            return;
        }

        try {
            $iduser = $_SESSION['user_id'];

            $pdo = Conexao::getConnection();

            $sql = "
                SELECT
                    sa.id_solicitacao,
                    p.nome_paciente,
                    sa.especialidade,
                    sa.horario_desejado,
                    sa.observacao_inicial,
                    sa.solicitacoes_status
                FROM solicitacoes_atendimento sa
                INNER JOIN paciente p
                    ON sa.id_paciente = p.id_paciente
                WHERE
                    (
                        sa.solicitacoes_status = 'APROVADA'
                        AND sa.id_aluno IS NULL
                    )
                    OR sa.id_aluno = (
                        SELECT a.id_aluno
                        FROM aluno a
                        WHERE a.id_usuario = ?
                    )
            ";

            $result = $pdo->prepare($sql);
            $result->execute([$iduser]);

            $solicitacoes = $result->fetchAll(\PDO::FETCH_ASSOC);

            $casosDisponiveis = [];
            $casosAssumidos = [];

            foreach ($solicitacoes as $caso) {
                switch ($caso['solicitacoes_status']) {
                    case 'ASSUMIDA':
                    case 'EM_ATENDIMENTO':
                        $casosAssumidos[] = $caso;
                        break;

                    default:
                        $casosDisponiveis[] = $caso;
                        break;
                }
            }

            http_response_code(200);

            echo json_encode([
                'casos_disponiveis' => $casosDisponiveis,
                'casos_assumidos' => $casosAssumidos
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            error_log(
                'Erro ao listar casos do aluno: ' . $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                'erro' => 'Erro interno ao listar os casos.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }


    // não está sendo utilizado!
    public function MeusCasos($id_aluno)
    {

        $pdo = Conexao::getConnection();

        try {

            $sql = "SELECT solicitacoes_atendimento.id_paciente, solicitacoes_atendimento.id_solicitacao, paciente.nome_paciente, solicitacoes_atendimento.especialidade,solicitacoes_atendimento.horario_desejado, solicitacoes_atendimento.observacao_inicial, solicitacoes_atendimento.solicitacoes_status
                    FROM solicitacoes_atendimento
                    INNER JOIN paciente ON paciente.id_paciente = solicitacoes_atendimento.id_paciente
                    WHERE solicitacoes_atendimento.id_aluno = ? and solicitacoes_atendimento.solicitacoes_status = 'APROVADA'
                    ;";


            $meuscasos = $pdo->prepare($sql);

            $meuscasos->execute([$id_aluno]);

            $solicitacoes = $meuscasos->fetchAll(\PDO::FETCH_ASSOC);

            if (count($solicitacoes) > 0) {

                $_SESSION['id_solicitacao'] = $solicitacoes['id_solicitacao'];

            }

            require dirname(__DIR__, 2). '/App/Views/Aluno/AreaAluno.php';

            exit;


        } catch (\Exception $e) {

            error_log("Erro ao listar paciente: ".$e->getMessage());

            echo "Erro ao listar paciente: ".$e->getMessage();

            exit;

        }

    }


    public function assumir()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'erro' => 'Aluno não autenticado.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // O frontend enviará os dados usando FormData.
        $idSolicitacao = filter_input(
            INPUT_POST,
            'id_solicitacao',
            FILTER_VALIDATE_INT
        );

        if (!$idSolicitacao || $idSolicitacao <= 0) {
            http_response_code(400);
            echo json_encode([
                'erro' => 'ID da solicitação inválido.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $pdo = Conexao::getConnection();
            $idUsuario = $_SESSION['user_id'];

            $sql = "
                UPDATE solicitacoes_atendimento
                SET
                    solicitacoes_status = 'ASSUMIDA',
                    id_aluno = (
                        SELECT a.id_aluno
                        FROM aluno a
                        WHERE a.id_usuario = ?
                        LIMIT 1
                    )
                WHERE id_solicitacao = ?
                AND solicitacoes_status = 'APROVADA'
                AND id_aluno IS NULL
                AND EXISTS (
                    SELECT 1
                    FROM aluno a
                    WHERE a.id_usuario = ?
                )
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $idUsuario,
                $idSolicitacao,
                $idUsuario
            ]);

            if ($stmt->rowCount() === 0) {
                http_response_code(409);
                echo json_encode([
                    'erro' => 'Este caso não está mais disponível. Atualize a listagem.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            $_SESSION['id_solicitacao'] = $idSolicitacao;

            http_response_code(200);
            echo json_encode([
                'mensagem' => 'Caso assumido com sucesso!',
                'id_solicitacao' => $idSolicitacao
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            error_log('Erro ao assumir caso: ' . $e->getMessage());

            http_response_code(500);
            echo json_encode([
                'erro' => 'Erro interno ao assumir o caso.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }



    public function dadosAluno()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);

            echo json_encode([
                'erro' => 'Aluno não autenticado.'
            ]);

            return;
        }

        try {
            $pdo = Conexao::getConnection();

            $sql = "
                SELECT
                    usuario.nome_user AS nome,
                    aluno.matricula AS matricula,
                    aluno.semestre AS semestre
                FROM aluno
                INNER JOIN usuario
                    ON usuario.id_user = aluno.id_usuario
                WHERE aluno.id_usuario = ?
                LIMIT 1
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_SESSION['user_id']]);

            $aluno = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$aluno) {
                http_response_code(404);

                echo json_encode([
                    'erro' => 'Cadastro de aluno não encontrado.'
                ]);

                return;
            }

            http_response_code(200);

            echo json_encode([
                'aluno' => $aluno
            ]);

        } catch (\Throwable $e) {
            error_log('Erro ao consultar dados do aluno: ' . $e->getMessage());

            http_response_code(500);

            echo json_encode([
                'erro' => 'Erro interno ao consultar os dados do aluno.'
            ]);
        }
    }

}
