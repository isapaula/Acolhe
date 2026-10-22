<?php

namespace App\Controller;

use App\Database\Conexao;

class SolicitacaoController
{

    public function aprovar()
    {
        $this->atualizarStatusProfessor('APROVADA');
    }

    public function recusar()
    {
        $this->atualizarStatusProfessor('RECUSADA');
    }

    public function store()
    {
        header('Content-Type: application/json; charset=utf-8');


        if (empty($_SESSION['user_id'])) {
            http_response_code(401);

            echo json_encode([
                'erro' => 'Usuário não autenticado.'
            ]);

            return;
        }

        $dados = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (!is_array($dados)) {
            http_response_code(400);

            echo json_encode([
                'erro' => 'JSON inválido.'
            ]);

            return;
        }

        $especialidade = $dados['especialidade'] ?? null;
        $horario_desejado = $dados['selecthora'] ?? null;
        $observacao = $dados['observacao'] ?? null;

        if (
            !is_string($especialidade) ||
            trim($especialidade) === '' ||
            !is_string($horario_desejado) ||
            trim($horario_desejado) === '' ||
            !is_string($observacao)
        ) {
            http_response_code(400);

            echo json_encode([
                'erro' => 'Dados da solicitação inválidos ou incompletos.'
            ]);

            return;
        }

        $iduser = $_SESSION['user_id'];

        try {
            $pdo = Conexao::getConnection();

            $stmt = $pdo->prepare(
                "SELECT id_paciente
                FROM paciente
                WHERE id_usuario = ?"
            );

            $stmt->execute([$iduser]);

            $paciente = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$paciente) {
                http_response_code(403);

                echo json_encode([
                    'erro' => 'Somente pacientes cadastrados podem solicitar atendimento.'
                ]);

                return;
            }

            $idPaciente = $paciente['id_paciente'];


            $pdo->beginTransaction();

            $stmt = $pdo->prepare(
                "INSERT INTO solicitacoes_atendimento
                    (id_paciente, especialidade, horario_desejado, observacao_inicial)
                VALUES (?, ?, ?, ?)"
            );

            $stmt->execute([
                $idPaciente,
                trim($especialidade),
                trim($horario_desejado),
                trim($observacao)
            ]);

            $idSolicitacao = $pdo->lastInsertId();

            $pdo->commit();

            // 6. Retorna a resposta da API
            http_response_code(201);

            echo json_encode([
                'mensagem' => 'Solicitação cadastrada com sucesso.',
                'solicitacao' => [
                    'id' => $idSolicitacao,
                    'id_paciente' => $idPaciente,
                    'especialidade' => trim($especialidade),
                    'horario_desejado' => trim($horario_desejado),
                    'observacao_inicial' => trim($observacao)
                ]
            ]);

        
        } catch (\Throwable $e) {

            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }

            error_log(
                'Erro ao cadastrar solicitação: ' . $e->getMessage()
            );

            $erroInfo = $e instanceof \PDOException
                ? $e->errorInfo
                : null;

            $sqlState = $erroInfo[0] ?? $e->getCode();
            $codigoMySQL = $erroInfo[1] ?? null;
            $mensagemErro = $e->getMessage();

            $violacaoSolicitacaoAtiva =
                $sqlState === '23000' &&
                (int) $codigoMySQL === 1062 &&
                str_contains(
                    $mensagemErro,
                    'uq_solicitacao_paciente_ativa'
                );

            if ($violacaoSolicitacaoAtiva) {
                http_response_code(409);

                echo json_encode([
                    'erro' => 'Você já possui uma solicitação de atendimento ativa.'
                ]);

                return;
            }

            http_response_code(500);

            echo json_encode([
                'erro' => 'Erro interno ao cadastrar a solicitação.'
            ]);
        }

    }

    public function status()
    {
        header('Content-Type: application/json; charset=utf-8');


        if (empty($_SESSION['user_id'])) {
            http_response_code(401);

            echo json_encode([
                'erro' => 'Usuário não autenticado.'
            ]);

            return;
        }

        try {
            $pdo = Conexao::getConnection();

            $idUsuario = $_SESSION['user_id'];
            $papel = (int) ($_SESSION['user_papel'] ?? 0);

            if ($papel === 3) {
                $stmt = $pdo->query(
                    "SELECT
                        sa.id_solicitacao,
                        sa.id_paciente,
                        sa.especialidade,
                        sa.horario_desejado,
                        sa.observacao_inicial,
                        sa.solicitacoes_status,
                        sa.created_at,
                        p.nome_paciente AS nome_paciente
                    FROM solicitacoes_atendimento sa
                    INNER JOIN paciente p
                        ON p.id_paciente = sa.id_paciente
                    ORDER BY sa.id_solicitacao DESC"
                );

                $solicitacoes = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                echo json_encode([
                    'solicitacoes' => $solicitacoes
                ]);

                return;
            }

            $stmt = $pdo->prepare(
                "SELECT id_paciente
                FROM paciente
                WHERE id_usuario = ?"
            );

            $stmt->execute([$idUsuario]);
            $paciente = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$paciente) {
                http_response_code(403);

                echo json_encode([
                    'erro' => 'Usuário não possui cadastro de paciente.'
                ]);

                return;
            }

            $stmt = $pdo->prepare(
                "SELECT
                    id_solicitacao,
                    especialidade,
                    horario_desejado,
                    solicitacoes_status
                FROM solicitacoes_atendimento
                WHERE id_paciente = ?
                ORDER BY id_solicitacao DESC
                LIMIT 1"
            );

            $stmt->execute([$paciente['id_paciente']]);
            $solicitacao = $stmt->fetch(\PDO::FETCH_ASSOC);

            echo json_encode([
                'solicitacao' => $solicitacao ?: null
            ]);

        } catch (\Throwable $e) {
            error_log(
                'Erro ao consultar solicitações: ' . $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                'erro' => 'Erro interno ao consultar solicitações.'
            ]);
        }
    }

    private function atualizarStatusProfessor(string $novoStatus)
    {
        header('Content-Type: application/json; charset=utf-8');

        // Estas operações aceitam somente POST.
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Allow: POST');
            http_response_code(405);

            echo json_encode([
                'erro' => 'Método HTTP não permitido. Utilize POST.'
            ]);
            return;
        }

        // Verifica se existe uma sessão autenticada.
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);

            echo json_encode([
                'erro' => 'Usuário não autenticado.'
            ]);
            return;
        }

        // O papel 3 corresponde ao professor neste projeto.
        if ((int) ($_SESSION['user_papel'] ?? 0) !== 3) {
            http_response_code(403);

            echo json_encode([
                'erro' => 'Apenas professores podem analisar solicitações.'
            ]);
            return;
        }

        // Lê o JSON enviado pelo React.
        $dados = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (!is_array($dados)) {
            http_response_code(400);

            echo json_encode([
                'erro' => 'JSON inválido.'
            ]);
            return;
        }

        $idSolicitacao = filter_var(
            $dados['id_solicitacao'] ?? null,
            FILTER_VALIDATE_INT
        );

        if ($idSolicitacao === false || $idSolicitacao === null || $idSolicitacao < 1) {
            http_response_code(400);

            echo json_encode([
                'erro' => 'ID da solicitação inválido.'
            ]);
            return;
        }

        $pdo = null;

        try {
            $pdo = \App\Database\Conexao::getConnection();
            $pdo->beginTransaction();

            // Bloqueia temporariamente o registro durante a análise.
            $stmt = $pdo->prepare(
                "SELECT solicitacoes_status
                FROM solicitacoes_atendimento
                WHERE id_solicitacao = ?
                FOR UPDATE"
            );

            $stmt->execute([$idSolicitacao]);

            $solicitacao = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$solicitacao) {
                $pdo->rollBack();

                http_response_code(404);

                echo json_encode([
                    'erro' => 'Solicitação não encontrada.'
                ]);
                return;
            }

            // Só é permitido analisar solicitações pendentes.
            if ($solicitacao['solicitacoes_status'] !== 'AGUARDANDO_TRIAGEM') {
                $pdo->rollBack();

                http_response_code(409);

                echo json_encode([
                    'erro' => 'Esta solicitação já foi analisada ou não pode ser alterada.'
                ]);
                return;
            }

            $update = $pdo->prepare(
                "UPDATE solicitacoes_atendimento
                SET solicitacoes_status = ?
                WHERE id_solicitacao = ?"
            );

            $update->execute([
                $novoStatus,
                $idSolicitacao
            ]);

            $pdo->commit();

            echo json_encode([
                'mensagem' => $novoStatus === 'APROVADA'
                    ? 'Solicitação aprovada com sucesso.'
                    : 'Solicitação recusada com sucesso.',
                'id_solicitacao' => $idSolicitacao,
                'solicitacoes_status' => $novoStatus
            ]);

        } catch (\Throwable $e) {
            if ($pdo instanceof \PDO && $pdo->inTransaction()) {
                $pdo->rollBack();
            }

            error_log(
                'Erro ao atualizar solicitação: ' . $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                'erro' => 'Erro interno ao atualizar a solicitação.'
            ]);
        }
        }


}
