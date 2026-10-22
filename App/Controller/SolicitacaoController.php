<?php

namespace App\Controller;
use App\Service\SolicitacaoService;
use App\Database\Conexao;

class SolicitacaoController
{

    private function servico(): SolicitacaoService
    {
        return new SolicitacaoService(
            Conexao::getConnection()
        );
    }

    public function aprovar()
    {
        $this->atualizarStatusProfessor('APROVADA');
    }

    public function recusar()
    {
        $this->atualizarStatusProfessor('RECUSADA');
    }

    public function store(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'mensagem' => 'Usuário não autenticado.'
            ]);
            return;
        }

        $dados = json_decode(file_get_contents('php://input'), true);

        if (!is_array($dados)) {
            http_response_code(400);
            echo json_encode([
                'mensagem' => 'Dados inválidos.'
            ]);
            return;
        }

        $especialidade = $dados['especialidade'] ?? null;
        $horarioDesejado = $dados['selecthora'] ?? null;
        $observacao = $dados['observacao'] ?? null;

        if (
            !is_string($especialidade) ||
            trim($especialidade) === '' ||
            !is_string($horarioDesejado) ||
            trim($horarioDesejado) === '' ||
            !is_string($observacao)
        ) {
            http_response_code(400);
            echo json_encode([
                'mensagem' => 'Preencha corretamente os dados da solicitação.'
            ]);
            return;
        }

        try {
            $servico = $this->servico();

            $idPaciente = $servico->buscarIdPacientePorUsuario(
                (int) $_SESSION['user_id']
            );

            if ($idPaciente === null) {
                http_response_code(403);
                echo json_encode([
                    'mensagem' => 'Somente pacientes cadastrados podem solicitar atendimento.'
                ]);
                return;
            }

            $idSolicitacao = $servico->criarSolicitacao(
                $idPaciente,
                $especialidade,
                $horarioDesejado,
                $observacao
            );

            http_response_code(201);
            echo json_encode([
                'mensagem' => 'Solicitação cadastrada com sucesso.',
                'solicitacao' => [
                    'id' => $idSolicitacao,
                    'id_paciente' => $idPaciente,
                    'especialidade' => trim($especialidade),
                    'horario_desejado' => trim($horarioDesejado),
                    'observacao_inicial' => trim($observacao)
                ]
            ], JSON_UNESCAPED_UNICODE);
        } catch (\PDOException $e) {
            error_log('Erro ao cadastrar solicitação: ' . $e->getMessage());

            $codigoMySQL = (int) ($e->errorInfo[1] ?? 0);

            if (
                $e->getCode() === '23000' &&
                $codigoMySQL === 1062 &&
                str_contains($e->getMessage(), 'uq_solicitacao_paciente_ativa')
            ) {
                http_response_code(409);
                echo json_encode([
                    'mensagem' => 'Você já possui uma solicitação de atendimento ativa.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            http_response_code(500);
            echo json_encode([
                'mensagem' => 'Erro interno ao cadastrar a solicitação.'
            ], JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            error_log('Erro ao cadastrar solicitação: ' . $e->getMessage());

            http_response_code(500);
            echo json_encode([
                'mensagem' => 'Erro interno ao cadastrar a solicitação.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    public function status(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'mensagem' => 'Usuário não autenticado.'
            ]);
            return;
        }

        try {
            $servico = $this->servico();

            // Professor: visualiza todas as solicitações.
            if ((int) ($_SESSION['user_papel'] ?? 0) === 3) {
                $solicitacoes = $servico->listarSolicitacoesProfessor();

                echo json_encode([
                    'solicitacoes' => $solicitacoes
                ], JSON_UNESCAPED_UNICODE);

                return;
            }

            // Paciente: visualiza somente a própria solicitação mais recente.
            $idPaciente = $servico->buscarIdPacientePorUsuario(
                (int) $_SESSION['user_id']
            );

            if ($idPaciente === null) {
                http_response_code(403);
                echo json_encode([
                    'mensagem' => 'Usuário não possui cadastro de paciente.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            $solicitacao = $servico->buscarUltimaSolicitacaoPaciente(
                $idPaciente
            );

            echo json_encode([
                'solicitacao' => $solicitacao
            ], JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            error_log('Erro ao consultar solicitações: ' . $e->getMessage());

            http_response_code(500);
            echo json_encode([
                'mensagem' => 'Erro interno ao consultar solicitações.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    private function atualizarStatusProfessor(string $novoStatus): void
    {
        header('Content-Type: application/json; charset=utf-8');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Allow: POST');
            http_response_code(405);
            echo json_encode([
                'mensagem' => 'Método não permitido.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'mensagem' => 'Usuário não autenticado.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        if ((int) ($_SESSION['user_papel'] ?? 0) !== 3) {
            http_response_code(403);
            echo json_encode([
                'mensagem' => 'Apenas professores podem analisar solicitações.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $dados = json_decode(file_get_contents('php://input'), true);

        if (!is_array($dados)) {
            http_response_code(400);
            echo json_encode([
                'mensagem' => 'Dados inválidos.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $idSolicitacao = filter_var(
            $dados['id_solicitacao'] ?? null,
            FILTER_VALIDATE_INT
        );

        if ($idSolicitacao === false || $idSolicitacao === null || $idSolicitacao < 1) {
            http_response_code(400);
            echo json_encode([
                'mensagem' => 'ID da solicitação inválido.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $resultado = $this->servico()->atualizarStatus(
                $idSolicitacao,
                $novoStatus
            );

            if ($resultado === 'nao_encontrada') {
                http_response_code(404);
                echo json_encode([
                    'mensagem' => 'Solicitação não encontrada.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            if ($resultado === 'ja_analisada') {
                http_response_code(409);
                echo json_encode([
                    'mensagem' => 'Esta solicitação já foi analisada ou não pode ser alterada.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            $mensagem = $novoStatus === 'APROVADA'
                ? 'Solicitação aprovada com sucesso.'
                : 'Solicitação recusada com sucesso.';

            echo json_encode([
                'mensagem' => $mensagem,
                'id_solicitacao' => $idSolicitacao,
                'solicitacoes_status' => $novoStatus
            ], JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            error_log('Erro ao atualizar solicitação: ' . $e->getMessage());

            http_response_code(500);
            echo json_encode([
                'mensagem' => 'Erro interno ao atualizar a solicitação.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

}