<?php

namespace App\Controller;

use App\Database\Conexao;
use App\Service\SessaoService;

class SessaoController
{
   
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
            $servico = new SessaoService(
                Conexao::getConnection()
            );

            $resultado = $servico->agendarSessao(
                (int) $idSolicitacao,
                (int) $_SESSION['user_id'],
                $dataSessao,
                $horaInicio,
                $horaFim
            );

            switch ($resultado['status']) {
                case 'nao_autorizada':
                    http_response_code(403);
                    echo json_encode([
                        'sucesso' => false,
                        'erro' => 'A solicitação não existe ou não pertence a este aluno.'
                    ]);
                    return;

                case 'data_passada':
                    http_response_code(400);
                    echo json_encode([
                        'sucesso' => false,
                        'erro' => 'Não é permitido agendar uma sessão em uma data passada.'
                    ]);
                    return;

                case 'conflito':
                    http_response_code(409);
                    echo json_encode([
                        'sucesso' => false,
                        'erro' => 'O aluno já possui uma sessão nesse intervalo de horário.'
                    ]);
                    return;

                case 'agendada':
                    http_response_code(201);
                    echo json_encode([
                        'sucesso' => true,
                        'mensagem' => 'Sessão agendada com sucesso.',
                        'sessao' => $resultado['sessao']
                    ]);
                    return;

                default:
                    throw new \RuntimeException(
                        'Resultado inesperado ao agendar sessão.'
                    );
            }
        } catch (\Throwable $e) {
        error_log('Erro ao agendar sessão: ' . $e->getMessage());

        http_response_code(500);
        echo json_encode([
            'sucesso' => false,
            'erro' => 'Ocorreu um erro inesperado ao agendar a sessão.'
        ]);
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
            $servico = new SessaoService(
                Conexao::getConnection()
            );

            $idUsuario = (int) $_SESSION['user_id'];

            $sessoes = $servico->listarProximasSessoes(
                $idUsuario
            );

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
            $servico = new SessaoService(
                Conexao::getConnection()
            );

            $idUsuario = (int) $_SESSION['user_id'];

            $idPaciente = $servico->buscarIdPacientePorUsuario(
                $idUsuario
            );

            if ($idPaciente === null) {
                http_response_code(403);

                echo json_encode([
                    'erro' => 'Usuário não possui cadastro de paciente.'
                ], JSON_UNESCAPED_UNICODE);

                return;
            }

            $sessoes = $servico->listarSessoesPaciente(
                $idPaciente
            );

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
            $servico = new SessaoService(
                Conexao::getConnection()
            );

            $idUsuario = (int) $_SESSION['user_id'];

            $sessoes = $servico->listarSessoesAguardandoRegistro(
                $idUsuario
            );

            http_response_code(200);

            echo json_encode([
                'sessoes' => $sessoes
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

        if (!$idSessao || !is_string($observacao)) {
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
            $servico = new SessaoService(
                Conexao::getConnection()
            );

            $resultado = $servico->registrarRealizacao(
                (int) $idSessao,
                (int) $_SESSION['user_id'],
                $observacao
            );

            switch ($resultado) {
                case 'nao_encontrada':
                    http_response_code(404);
                    echo json_encode([
                        'sucesso' => false,
                        'erro' => 'Sessão não encontrada para este aluno.'
                    ], JSON_UNESCAPED_UNICODE);
                    return;

                case 'indisponivel':
                    http_response_code(409);
                    echo json_encode([
                        'sucesso' => false,
                        'erro' => 'Esta sessão já foi registrada ou não está disponível para registro.'
                    ], JSON_UNESCAPED_UNICODE);
                    return;

                case 'horario_futuro':
                    http_response_code(400);
                    echo json_encode([
                        'sucesso' => false,
                        'erro' => 'Só é possível registrar a realização após o horário de término da sessão.'
                    ], JSON_UNESCAPED_UNICODE);
                    return;

                case 'atualizacao_falhou':
                    http_response_code(409);
                    echo json_encode([
                        'sucesso' => false,
                        'erro' => 'Não foi possível registrar a sessão. Atualize a lista e tente novamente.'
                    ], JSON_UNESCAPED_UNICODE);
                    return;

                case 'realizada':
                    http_response_code(200);
                    echo json_encode([
                        'sucesso' => true,
                        'mensagem' => 'Realização da sessão registrada com sucesso.',
                        'id_sessao' => (int) $idSessao,
                        'status_sessao' => 'REALIZADA'
                    ], JSON_UNESCAPED_UNICODE);
                    return;

                default:
                    throw new \RuntimeException(
                        'Resultado inesperado ao registrar realização da sessão.'
                    );
            }
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
            $servico = new SessaoService(
                Conexao::getConnection()
            );

            $idUsuario = (int) $_SESSION['user_id'];

            $sessoes = $servico->listarSessoesRealizadasAluno(
                $idUsuario
            );

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
