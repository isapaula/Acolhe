USE clinica;

-- =====================================================
-- DADOS DE TESTE DO ACOLHE
-- Professor e dois pacientes para testar a triagem.
-- =====================================================

SET @senha_hash = '$2y$10$PMCQ.Q2YKDbdlo9kL1glZeRoRciqvGDBtucmYYpg5Chfq8w.xh6li';

-- -----------------------------------------------------
-- 1. PROFESSOR DE TESTE
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user,
    email_user,
    telefone,
    senha_user,
    id_papel,
    ativo
)
VALUES (
    'Professor Teste Acolhe',
    'professor.teste@acolhe.local',
    '11999990001',
    @senha_hash,
    3,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_professor_usuario = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'professor.teste@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_professor_usuario, 3)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO professor (
    id_usuario,
    registro_profissional,
    ativo
)
VALUES (
    @id_professor_usuario,
    'CRP-TESTE-001',
    1
)
ON DUPLICATE KEY UPDATE
    registro_profissional = VALUES(registro_profissional),
    ativo = 1;

-- -----------------------------------------------------
-- 2. PACIENTE PARA TESTAR APROVAÇÃO
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user,
    email_user,
    telefone,
    senha_user,
    id_papel,
    ativo
)
VALUES (
    'Paciente Teste Aprovacao',
    'paciente.aprovacao@acolhe.local',
    '11999990002',
    @senha_hash,
    1,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_aprovacao = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'paciente.aprovacao@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_aprovacao, 1)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO paciente (
    id_usuario,
    nome_paciente,
    data_nascimento,
    ativo
)
VALUES (
    @id_usuario_aprovacao,
    'Paciente Teste Aprovacao',
    '1990-01-15',
    1
)
ON DUPLICATE KEY UPDATE
    nome_paciente = VALUES(nome_paciente),
    data_nascimento = VALUES(data_nascimento),
    ativo = 1;

SET @id_paciente_aprovacao = (
    SELECT id_paciente
    FROM paciente
    WHERE id_usuario = @id_usuario_aprovacao
);

-- -----------------------------------------------------
-- 3. PACIENTE PARA TESTAR RECUSA
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user,
    email_user,
    telefone,
    senha_user,
    id_papel,
    ativo
)
VALUES (
    'Paciente Teste Recusa',
    'paciente.recusa@acolhe.local',
    '11999990003',
    @senha_hash,
    1,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_recusa = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'paciente.recusa@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_recusa, 1)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO paciente (
    id_usuario,
    nome_paciente,
    data_nascimento,
    ativo
)
VALUES (
    @id_usuario_recusa,
    'Paciente Teste Recusa',
    '1992-05-20',
    1
)
ON DUPLICATE KEY UPDATE
    nome_paciente = VALUES(nome_paciente),
    data_nascimento = VALUES(data_nascimento),
    ativo = 1;

SET @id_paciente_recusa = (
    SELECT id_paciente
    FROM paciente
    WHERE id_usuario = @id_usuario_recusa
);

-- -----------------------------------------------------
-- 4. SOLICITAÇÕES PENDENTES PARA A TRIAGEM
-- -----------------------------------------------------

-- Remove primeiro os registros dependentes das solicitações
-- desses pacientes de teste, evitando conflitos com FKs.

DELETE FROM acompanhamentos
WHERE id_solicitacao IN (
    SELECT id_solicitacao
    FROM solicitacoes_atendimento
    WHERE id_paciente IN (
        @id_paciente_aprovacao,
        @id_paciente_recusa
    )
);

DELETE FROM sessao
WHERE id_solicitacao IN (
    SELECT id_solicitacao
    FROM solicitacoes_atendimento
    WHERE id_paciente IN (
        @id_paciente_aprovacao,
        @id_paciente_recusa
    )
);

-- Agora podemos remover as solicitações anteriores.
DELETE FROM solicitacoes_atendimento
WHERE id_paciente IN (
    @id_paciente_aprovacao,
    @id_paciente_recusa
);

-- Cria novamente as duas solicitações pendentes.
INSERT INTO solicitacoes_atendimento (
    id_paciente,
    id_aluno,
    especialidade,
    horario_desejado,
    observacao_inicial,
    solicitacoes_status
)
VALUES
(
    @id_paciente_aprovacao,
    NULL,
    'Ansiedade',
    'Segunda-feira, período da manhã',
    'Solicitação criada para testar o fluxo de aprovação.',
    'AGUARDANDO_TRIAGEM'
),
(
    @id_paciente_recusa,
    NULL,
    'Depressão',
    'Quarta-feira, período da tarde',
    'Solicitação criada para testar o fluxo de recusa.',
    'AGUARDANDO_TRIAGEM'
);
