<?php

namespace App\Controller;

use App\Database\Conexao;

class SessaoController
{
    public function index()
    {

        if (isset($_SESSION['user_id'])) {

            $iduser = $_SESSION['user_id'];

            try {

                $pdo = Conexao::getConnection();

                $sql = "SELECT sessao.id_sessao, paciente.nome_paciente,  solicitacoes_atendimento.solicitacoes_status, sessao.data_sessao, sessao.hora_inicio , sessao.hora_fim, status_sessao FROM solicitacoes_atendimento
                INNER JOIN aluno ON solicitacoes_atendimento.id_aluno = aluno.id_aluno
                INNER JOIN paciente ON paciente.id_paciente = solicitacoes_atendimento.id_paciente
                INNER JOIN sessao ON sessao.id_solicitacao = solicitacoes_atendimento.id_solicitacao WHERE aluno.id_usuario = ?;";

                $select =  $pdo->prepare($sql);

                $select->execute([$iduser]);

                $result = $select->fetchAll(\PDO::FETCH_ASSOC);

                require dirname(__DIR__, 2). '/App/Views/Aluno/Sessoes.php';


            } catch (\PDOException $e) {

                error_log("Não foi possível mostrar suas sessões!". $e->getMessage());
                echo "Não foi possível mostrar suas sessões!". $e->getMessage();

            }
        }
    }

    public function create()
    {

        require dirname(__DIR__, 2). '/App/Views/Aluno/CriarSessao.php';
    }

    
    public function store()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'É necessário estar autenticado para agendar uma sessão.'
            ]);
            return;
        }

        $dados = json_decode(file_get_contents('php://input'), true);

        if (!is_array($dados)) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'O corpo da requisição deve conter um JSON válido.'
            ]);
            return;
        }

        $idSolicitacao = filter_var(
            $dados['id_solicitacao'] ?? null,
            FILTER_VALIDATE_INT
        );

        $dataSessao = $dados['data_sessao'] ?? '';
        $horaInicio = $dados['hora_inicio'] ?? '';
        $horaFim = $dados['hora_fim'] ?? '';


        if (
            !$idSolicitacao ||
            !is_string($dataSessao) ||
            !is_string($horaInicio) ||
            !is_string($horaFim) ||
            $dataSessao === '' ||
            $horaInicio === '' ||
            $horaFim === ''
        ) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Informe a solicitação, a data e os horários da sessão.'
            ]);
            return;
        }

        $data = \DateTime::createFromFormat('!Y-m-d', $dataSessao);
        $errosData = \DateTime::getLastErrors();

        if (
            !$data ||
            ($errosData !== false &&
                ($errosData['warning_count'] > 0 || $errosData['error_count'] > 0)) ||
            $data->format('Y-m-d') !== $dataSessao
        ) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'A data da sessão é inválida.'
            ]);
            return;
        }

        $validarHora = static function ($hora) {
            return is_string($hora) &&
                preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/', $hora);
        };

        if (!$validarHora($horaInicio) || !$validarHora($horaFim)) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Informe horários válidos.'
            ]);
            return;
        }

        // Normaliza os horários para comparação e gravação.
        $horaInicio = substr($horaInicio, 0, 5) . ':00';
        $horaFim = substr($horaFim, 0, 5) . ':00';

        if ($horaFim <= $horaInicio) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'O horário de término deve ser posterior ao início.'
            ]);
            return;
        }

        try {
            $pdo = \App\Database\Conexao::getConnection();
            $idUsuario = $_SESSION['user_id'];

            // Confirma que a solicitação pertence ao aluno autenticado.
            $sqlSolicitacao = " SELECT sa.id_solicitacao, sa.id_aluno, sa.solicitacoes_status FROM solicitacoes_atendimento sa
                INNER JOIN aluno a ON a.id_aluno = sa.id_aluno WHERE sa.id_solicitacao = ? AND a.id_usuario = ? LIMIT 1 ";

            $stmtSolicitacao = $pdo->prepare($sqlSolicitacao);
            $stmtSolicitacao->execute([$idSolicitacao, $idUsuario]);
            $solicitacao = $stmtSolicitacao->fetch(\PDO::FETCH_ASSOC);

            if (!$solicitacao) {
                http_response_code(403);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => 'A solicitação não existe ou não pertence a este aluno.'
                ]);
                return;
            }

            // Impede agendar uma sessão em uma data passada.
            if ($dataSessao < date('Y-m-d')) {
                http_response_code(400);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => 'Não é permitido agendar uma sessão em uma data passada.'
                ]);
                return;
            }

            $pdo->beginTransaction();

            // Verifica conflito de horário com outra sessão do mesmo aluno.
            $sqlConflito = " SELECT COUNT(*) FROM sessao WHERE id_aluno = ? AND data_sessao = ? AND hora_inicio < ? AND hora_fim > ? ";

            $stmtConflito = $pdo->prepare($sqlConflito);
            $stmtConflito->execute([
                $solicitacao['id_aluno'],
                $dataSessao,
                $horaFim,
                $horaInicio
            ]);

            if ((int) $stmtConflito->fetchColumn() > 0) {
                $pdo->rollBack();

                http_response_code(409);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => 'O aluno já possui uma sessão nesse intervalo de horário.'
                ]);
                return;
            }

            $sqlInsert = " INSERT INTO sessao (id_solicitacao, id_aluno,
                    data_sessao,
                    hora_inicio,
                    hora_fim,
                    status_sessao
                )
                VALUES (?, ?, ?, ?, ?, ?)
            ";

            $stmtInsert = $pdo->prepare($sqlInsert);
            $stmtInsert->execute([
                $idSolicitacao,
                $solicitacao['id_aluno'],
                $dataSessao,
                $horaInicio,
                $horaFim,
                'AGENDADA'
            ]);

            $idSessao = (int) $pdo->lastInsertId();

            $stmtUpdate = $pdo->prepare("
                UPDATE solicitacoes_atendimento
                SET solicitacoes_status = 'EM_ATENDIMENTO'
                WHERE id_solicitacao = ?
            ");
            $stmtUpdate->execute([$idSolicitacao]);

            $pdo->commit();

            http_response_code(201);
            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Sessão agendada com sucesso.',
                'sessao' => [
                    'id_sessao' => $idSessao,
                    'id_solicitacao' => (int) $idSolicitacao,
                    'data_sessao' => $dataSessao,
                    'hora_inicio' => $horaInicio,
                    'hora_fim' => $horaFim,
                    'status_sessao' => 'AGENDADA'
                ]
            ]);
        } catch (\PDOException $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }

            error_log('Erro ao agendar sessão: ' . $e->getMessage());

            http_response_code(500);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Não foi possível agendar a sessão.'
            ]);
        } catch (\Throwable $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }

            error_log('Erro inesperado ao agendar sessão: ' . $e->getMessage());

            http_response_code(500);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Ocorreu um erro inesperado ao agendar a sessão.'
            ]);
        }
    }


    public function updateStatus()
    {

        if (!isset($_POST['id_sessao'], $_POST['status'])) {
            echo "Dados inválidos.";
        }

        $status = $_POST['status'];
        $idSessao = $_POST['id_sessao'];

        try {

            $pdo = Conexao::getConnection();

            $sql = "UPDATE sessao 
                    SET status_sessao = ? 
                    WHERE id_sessao = ? ";

            $update = $pdo->prepare($sql);

            $update->execute([$status, $idSessao]);

            header("Location: /Psychology-clinic-project/public/sessao/index");
            exit;

        } catch (\Exception $e) {
            error_log("Erro ao atualizar status da sessão: " . $e->getMessage());
            echo "Não foi possível atualizar o status da sessão." . $e->getMessage();
        }
    }


    public function proximasSessoes()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);

            echo json_encode([
                'erro' => 'Aluno não autenticado.'
            ], JSON_UNESCAPED_UNICODE);

            return;
        }

        try {
            $pdo = \App\Database\Conexao::getConnection();
            $idUsuario = $_SESSION['user_id'];

            $sql = "
                SELECT
                    s.id_sessao,
                    s.id_solicitacao,
                    p.nome_paciente,
                    s.data_sessao,
                    s.hora_inicio,
                    s.hora_fim,
                    s.status_sessao
                FROM sessao s
                INNER JOIN solicitacoes_atendimento sa
                    ON sa.id_solicitacao = s.id_solicitacao
                INNER JOIN paciente p
                    ON p.id_paciente = sa.id_paciente
                INNER JOIN aluno a
                    ON a.id_aluno = s.id_aluno
                WHERE a.id_usuario = ?
                AND s.status_sessao = 'AGENDADA'
                AND (
                        s.data_sessao > CURDATE()
                        OR (
                            s.data_sessao = CURDATE()
                            AND s.hora_inicio >= CURTIME()
                        )
                )
                ORDER BY s.data_sessao ASC, s.hora_inicio ASC
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$idUsuario]);

            $sessoes = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            http_response_code(200);

            echo json_encode([
                'sessoes' => $sessoes
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            error_log(
                'Erro ao consultar próximas sessões do aluno: '
                . $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                'erro' => 'Não foi possível consultar as próximas sessões.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    public function sessoesPaciente()
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
            $pdo = \App\Database\Conexao::getConnection();
            $idUsuario = $_SESSION['user_id'];

            // Localiza o paciente associado ao usuário autenticado.
            $sqlPaciente = " SELECT id_paciente FROM paciente WHERE id_usuario = ? LIMIT 1 ";

            $stmtPaciente = $pdo->prepare($sqlPaciente);
            $stmtPaciente->execute([$idUsuario]);

            $paciente = $stmtPaciente->fetch(\PDO::FETCH_ASSOC);

            if (!$paciente) {
                http_response_code(403);

                echo json_encode([
                    'erro' => 'Usuário não possui cadastro de paciente.'
                ], JSON_UNESCAPED_UNICODE);

                return;
            }

            // Busca somente as sessões vinculadas a esse paciente.
            $sql = "
                SELECT
                    s.id_sessao,
                    s.id_solicitacao,
                    s.data_sessao,
                    s.hora_inicio,
                    s.hora_fim,
                    s.status_sessao,
                    u.nome_user AS nome_aluno
                FROM sessao s
                INNER JOIN solicitacoes_atendimento sa
                    ON sa.id_solicitacao = s.id_solicitacao
                INNER JOIN aluno a
                    ON a.id_aluno = s.id_aluno
                INNER JOIN usuario u
                    ON u.id_user = a.id_usuario
                WHERE sa.id_paciente = ? AND s.status_sessao = 'AGENDADA'
                ORDER BY
                    s.data_sessao ASC,
                    s.hora_inicio ASC
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$paciente['id_paciente']]);

            $sessoes = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            http_response_code(200);

            echo json_encode([
                'sessoes' => $sessoes
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            error_log(
                'Erro ao consultar sessões do paciente: '
                . $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                'erro' => 'Não foi possível consultar suas sessões.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    public function sessoesAguardandoRegistro()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'erro' => 'Aluno não autenticado.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $pdo = Conexao::getConnection();
            $idUsuario = $_SESSION['user_id'];

            $sql = "
                SELECT
                    s.id_sessao,
                    s.id_solicitacao,
                    p.nome_paciente,
                    s.data_sessao,
                    s.hora_inicio,
                    s.hora_fim,
                    s.status_sessao
                FROM sessao s
                INNER JOIN solicitacoes_atendimento sa
                    ON sa.id_solicitacao = s.id_solicitacao
                INNER JOIN paciente p
                    ON p.id_paciente = sa.id_paciente
                INNER JOIN aluno a
                    ON a.id_aluno = s.id_aluno
                WHERE a.id_usuario = ?
                AND s.status_sessao = 'AGENDADA'
                AND TIMESTAMP(s.data_sessao, s.hora_fim) < NOW()
                ORDER BY s.data_sessao ASC, s.hora_inicio ASC
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$idUsuario]);

            echo json_encode([
                'sessoes' => $stmt->fetchAll(\PDO::FETCH_ASSOC)
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            error_log(
                'Erro ao consultar sessões aguardando registro: '
                . $e->getMessage()
            );

            http_response_code(500);
            echo json_encode([
                'erro' => 'Não foi possível consultar as sessões aguardando registro.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    public function registrarRealizacao()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Aluno não autenticado.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $dados = json_decode(file_get_contents('php://input'), true);

        if (!is_array($dados)) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'O corpo da requisição deve conter um JSON válido.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $idSessao = filter_var(
            $dados['id_sessao'] ?? null,
            FILTER_VALIDATE_INT
        );

        $observacao = $dados['observacao'] ?? '';

        if (
            !$idSessao ||
            !is_string($observacao)
        ) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Informe uma sessão válida e uma observação válida.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $observacao = trim($observacao);

        if (strlen($observacao) > 100) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'A observação deve ter no máximo 100 caracteres.'
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $pdo = Conexao::getConnection();
            $idUsuario = $_SESSION['user_id'];

            // Confirma que a sessão pertence ao aluno autenticado.
            $sql = "
                SELECT
                    s.id_sessao,
                    s.status_sessao,
                    TIMESTAMP(s.data_sessao, s.hora_fim) AS fim_sessao
                FROM sessao s
                INNER JOIN aluno a
                    ON a.id_aluno = s.id_aluno
                WHERE s.id_sessao = ?
                AND a.id_usuario = ?
                LIMIT 1
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$idSessao, $idUsuario]);
            $sessao = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$sessao) {
                http_response_code(404);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => 'Sessão não encontrada para este aluno.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            if ($sessao['status_sessao'] !== 'AGENDADA') {
                http_response_code(409);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => 'Esta sessão já foi registrada ou não está disponível para registro.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            // O horário é validado pelo banco, não pelo relógio do navegador.
            $stmtHorario = $pdo->prepare("
                SELECT TIMESTAMP(data_sessao, hora_fim) < NOW()
                FROM sessao
                WHERE id_sessao = ?
            ");
            $stmtHorario->execute([$idSessao]);

            if (!(bool) $stmtHorario->fetchColumn()) {
                http_response_code(400);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => 'Só é possível registrar a realização após o horário de término da sessão.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            // Atualiza somente se a sessão ainda estiver aguardando registro.
            $sqlUpdate = "
                UPDATE sessao s
                INNER JOIN aluno a ON a.id_aluno = s.id_aluno
                SET
                    s.status_sessao = 'REALIZADA',
                    s.observacao = ?
                WHERE s.id_sessao = ?
                AND a.id_usuario = ?
                AND s.status_sessao = 'AGENDADA'
                AND TIMESTAMP(s.data_sessao, s.hora_fim) < NOW()
            ";

            $stmtUpdate = $pdo->prepare($sqlUpdate);
            $stmtUpdate->execute([
                $observacao !== '' ? $observacao : null,
                $idSessao,
                $idUsuario
            ]);

            if ($stmtUpdate->rowCount() !== 1) {
                http_response_code(409);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => 'Não foi possível registrar a sessão. Atualize a lista e tente novamente.'
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Realização da sessão registrada com sucesso.',
                'id_sessao' => (int) $idSessao,
                'status_sessao' => 'REALIZADA'
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            error_log(
                'Erro ao registrar realização da sessão: '
                . $e->getMessage()
            );

            http_response_code(500);
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Não foi possível registrar a realização da sessão.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }


    public function sessoesRealizadasAluno()
    {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['user_id'])) {
            http_response_code(401);

            echo json_encode([
                'erro' => 'Aluno não autenticado.'
            ], JSON_UNESCAPED_UNICODE);

            return;
        }

        try {
            $pdo = \App\Database\Conexao::getConnection();
            $idUsuario = $_SESSION['user_id'];

            $sql = "
                SELECT
                    s.id_sessao,
                    s.id_solicitacao,
                    p.nome_paciente,
                    s.data_sessao,
                    s.hora_inicio,
                    s.hora_fim,
                    s.status_sessao,
                    s.observacao
                FROM sessao s
                INNER JOIN solicitacoes_atendimento sa
                    ON sa.id_solicitacao = s.id_solicitacao
                INNER JOIN paciente p
                    ON p.id_paciente = sa.id_paciente
                INNER JOIN aluno a
                    ON a.id_aluno = s.id_aluno
                WHERE a.id_usuario = ?
                AND s.status_sessao = 'REALIZADA'
                ORDER BY
                    s.data_sessao DESC,
                    s.hora_inicio DESC
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$idUsuario]);

            $sessoes = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            http_response_code(200);

            echo json_encode([
                'sessoes' => $sessoes
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            error_log(
                'Erro ao consultar histórico de sessões realizadas do aluno: '
                . $e->getMessage()
            );

            http_response_code(500);

            echo json_encode([
                'erro' => 'Não foi possível consultar o histórico de sessões realizadas.'
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    
}
