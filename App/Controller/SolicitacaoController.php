<?php

namespace App\Controller;

use App\Database\Conexao;

class SolicitacaoController
{
    public function create()
    {

        require dirname(__DIR__, 2) . '/App/Views/paciente/SolicitarAtendimentoForm.php';

    }

    public function areaPaciente()
    {

        require dirname(__DIR__, 2). '/App/Views/paciente/AreaPaciente.php';
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


    public function statusSolicitação($idpaciente)
    {

        $pdo = Conexao::getConnection();

        try {

            $consulta = $pdo->prepare("SELECT solicitacoes_atendimento.solicitacoes_status  AS status_solicitacao FROM paciente
            INNER JOIN usuario ON usuario.id_user = paciente.id_usuario
            INNER JOIN solicitacoes_atendimento ON paciente.id_paciente = solicitacoes_atendimento.id_paciente
            WHERE solicitacoes_atendimento.id_paciente = :id_paciente
            ;");

            $consulta->execute([ 'id_paciente' => $idpaciente]);

            // dessa forma o sistema pega apenas uma solicitação atendimento do paciente, para pegar todas é necessário o fetchAll.
            $result  = $consulta->fetch(\PDO::FETCH_ASSOC);

            return $result;


        } catch (\Exception $e) {

            error_log("Erro ao consultar o status da solicitação: ".$e);
            echo "Erro ao consultar o status da solicitação: ".$e;

        }

    }


    public function status()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['erro' => 'Usuário não autenticado.']);
            return;
        }

        try {
            $pdo = Conexao::getConnection();

            $stmt = $pdo->prepare(
                "SELECT id_paciente
                FROM paciente
                WHERE id_usuario = ?"
            );
            $stmt->execute([$_SESSION['user_id']]);
            $paciente = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$paciente) {
                http_response_code(403);
                echo json_encode([
                    'erro' => 'Usuário não possui cadastro de paciente.'
                ]);
                return;
            }

            $stmt = $pdo->prepare(
                "SELECT id_solicitacao, especialidade,
                        horario_desejado, solicitacoes_status
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

}
