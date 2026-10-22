<?php

namespace App\Service;

use PDO;
use InvalidArgumentException;

class SolicitacaoService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function buscarIdPacientePorUsuario($idUsuario): ?int
    {
        $sql = "SELECT id_paciente
                FROM paciente
                WHERE id_usuario = ?
                LIMIT 1";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idUsuario]);

        $idPaciente = $stmt->fetchColumn();

        return $idPaciente !== false ? (int) $idPaciente : null;
    }

    public function criarSolicitacao(
        int $idPaciente,
        string $especialidade,
        string $horarioDesejado,
        string $observacao
    ): int {
        $sql = "INSERT INTO solicitacoes_atendimento
                    (id_paciente, especialidade, horario_desejado, observacao_inicial)
                VALUES (?, ?, ?, ?)";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $idPaciente,
            trim($especialidade),
            trim($horarioDesejado),
            trim($observacao)
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function listarSolicitacoesProfessor(): array
    {
        $sql = "SELECT
                    sa.id_solicitacao,
                    sa.id_paciente,
                    sa.id_aluno,
                    sa.especialidade,
                    sa.horario_desejado,
                    sa.observacao_inicial,
                    sa.solicitacoes_status,
                    sa.created_at,
                    p.nome_paciente,
                    u.nome_user AS nome_aluno
                FROM solicitacoes_atendimento sa
                INNER JOIN paciente p
                    ON p.id_paciente = sa.id_paciente
                LEFT JOIN aluno a
                    ON a.id_aluno = sa.id_aluno
                LEFT JOIN usuario u
                    ON u.id_user = a.id_usuario
                ORDER BY sa.id_solicitacao DESC";

        $stmt = $this->pdo->query($sql);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarUltimaSolicitacaoPaciente(
        int $idPaciente
    ): ?array {
        $sql = "SELECT
                    id_solicitacao,
                    especialidade,
                    horario_desejado,
                    solicitacoes_status
                FROM solicitacoes_atendimento
                WHERE id_paciente = ?
                ORDER BY id_solicitacao DESC
                LIMIT 1";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idPaciente]);

        $solicitacao = $stmt->fetch(PDO::FETCH_ASSOC);

        return $solicitacao ?: null;
    }

    public function atualizarStatus(
        int $idSolicitacao,
        string $novoStatus
    ): string {
        if (!in_array($novoStatus, ['APROVADA', 'RECUSADA'], true)) {
            throw new InvalidArgumentException(
                'Status de análise inválido.'
            );
        }

        $this->pdo->beginTransaction();

        try {
            $sql = "SELECT solicitacoes_status
                    FROM solicitacoes_atendimento
                    WHERE id_solicitacao = ?
                    FOR UPDATE";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$idSolicitacao]);

            $solicitacao = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$solicitacao) {
                $this->pdo->rollBack();
                return 'nao_encontrada';
            }

            if (
                $solicitacao['solicitacoes_status']
                !== 'AGUARDANDO_TRIAGEM'
            ) {
                $this->pdo->rollBack();
                return 'ja_analisada';
            }

            $sql = "UPDATE solicitacoes_atendimento
                    SET solicitacoes_status = ?
                    WHERE id_solicitacao = ?";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$novoStatus, $idSolicitacao]);

            $this->pdo->commit();

            return 'atualizada';
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $e;
        }
    }
}
