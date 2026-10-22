<?php

namespace App\Service;

use PDO;

class SessaoService
{
    public function __construct(
        private PDO $pdo
    ) {
    }

    public function listarProximasSessoes(int $idUsuario): array
    {
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
            ORDER BY
                s.data_sessao ASC,
                s.hora_inicio ASC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idUsuario]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarIdPacientePorUsuario(int $idUsuario): ?int
    {
        $sql = "
            SELECT id_paciente
            FROM paciente
            WHERE id_usuario = ?
            LIMIT 1
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idUsuario]);

        $idPaciente = $stmt->fetchColumn();

        return $idPaciente !== false ? (int) $idPaciente : null;
    }

    public function listarSessoesPaciente(int $idPaciente): array
    {
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
            WHERE sa.id_paciente = ?
            ORDER BY
                s.data_sessao ASC,
                s.hora_inicio ASC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idPaciente]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarSessoesAguardandoRegistro(int $idUsuario): array
    {
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
            ORDER BY
                s.data_sessao ASC,
                s.hora_inicio ASC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idUsuario]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarSessoesRealizadasAluno(int $idUsuario): array
    {
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

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idUsuario]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agendarSessao(
        int $idSolicitacao,
        int $idUsuario,
        string $dataSessao,
        string $horaInicio,
        string $horaFim
    ): array {
        $pdo = $this->pdo;

        // Confirma que a solicitação pertence ao aluno autenticado.
        $sqlSolicitacao = "
            SELECT
                sa.id_solicitacao,
                sa.id_aluno,
                sa.solicitacoes_status
            FROM solicitacoes_atendimento sa
            INNER JOIN aluno a
                ON a.id_aluno = sa.id_aluno
            WHERE sa.id_solicitacao = ?
                AND a.id_usuario = ?
            LIMIT 1
        ";

        $stmtSolicitacao = $pdo->prepare($sqlSolicitacao);
        $stmtSolicitacao->execute([$idSolicitacao, $idUsuario]);

        $solicitacao = $stmtSolicitacao->fetch(PDO::FETCH_ASSOC);

        if (!$solicitacao) {
            return [
                'status' => 'nao_autorizada'
            ];
        }

        // A validação usa a data do servidor PHP, como no comportamento atual.
        if ($dataSessao < date('Y-m-d')) {
            return [
                'status' => 'data_passada'
            ];
        }

        $pdo->beginTransaction();

        try {
        // Verifica conflito com outra sessão do mesmo aluno.
        $sqlConflito = "
            SELECT COUNT(*)
            FROM sessao
            WHERE id_aluno = ?
                AND data_sessao = ?
                AND hora_inicio < ?
                AND hora_fim > ?
        ";

        $stmtConflito = $pdo->prepare($sqlConflito);
        $stmtConflito->execute([
            $solicitacao['id_aluno'],
            $dataSessao,
            $horaFim,
            $horaInicio
        ]);

        if ((int) $stmtConflito->fetchColumn() > 0) {
            $pdo->rollBack();

            return [
                'status' => 'conflito'
            ];
        }

        $sqlInsert = "
            INSERT INTO sessao (
                id_solicitacao,
                id_aluno,
                data_sessao,
                hora_inicio,
                hora_fim,
                status_sessao
            ) VALUES (?, ?, ?, ?, ?, ?)
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

        return [
            'status' => 'agendada',
            'sessao' => [
                'id_sessao' => $idSessao,
                'id_solicitacao' => $idSolicitacao,
                'data_sessao' => $dataSessao,
                'hora_inicio' => $horaInicio,
                'hora_fim' => $horaFim,
                'status_sessao' => 'AGENDADA'
            ]
        ];
        } catch (\Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $e;
        }
    }

    public function registrarRealizacao(
        int $idSessao,
        int $idUsuario,
        string $observacao
    ): string {
        $pdo = $this->pdo;

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

        $sessao = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$sessao) {
            return 'nao_encontrada';
        }

        if ($sessao['status_sessao'] !== 'AGENDADA') {
            return 'indisponivel';
        }

        // O horário é validado pelo banco, não pelo navegador.
        $stmtHorario = $pdo->prepare("
            SELECT TIMESTAMP(data_sessao, hora_fim) < NOW()
            FROM sessao
            WHERE id_sessao = ?
        ");
        $stmtHorario->execute([$idSessao]);

        if (!(bool) $stmtHorario->fetchColumn()) {
            return 'horario_futuro';
        }

        // Atualiza somente se a sessão ainda estiver disponível
        // e se o horário de término já tiver passado.
        $sqlUpdate = "
            UPDATE sessao s
            INNER JOIN aluno a
                ON a.id_aluno = s.id_aluno
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
            return 'atualizacao_falhou';
        }

        return 'realizada';
    }


}