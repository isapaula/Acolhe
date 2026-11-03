
USE clinica;

-- =====================================================
-- DADOS DE TESTE DO ACOLHE
-- Professor, dois alunos e quatro pacientes.
-- Cenários: aprovação, recusa e atribuição de casos.
-- =====================================================

SET @senha_hash = '$2y$10$PMCQ.Q2YKDbdlo9kL1glZeRoRciqvGDBtucmYYpg5Chfq8w.xh6li';

-- -----------------------------------------------------
-- 1. PROFESSOR DE TESTE
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
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
    id_usuario, registro_profissional, ativo
)
VALUES (
    @id_professor_usuario, 'CRP-TESTE-001', 1
)
ON DUPLICATE KEY UPDATE
    registro_profissional = VALUES(registro_profissional),
    ativo = 1;


-- -----------------------------------------------------
-- 2. ALUNOS DE TESTE
-- -----------------------------------------------------

-- ALUNO 1
INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
)
VALUES (
    'Aluno Teste 1',
    'aluno.teste1@acolhe.local',
    '11999990004',
    @senha_hash,
    2,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_aluno1 = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'aluno.teste1@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_aluno1, 2)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO aluno (
    id_usuario, matricula, semestre, ativo
)
VALUES (
    @id_usuario_aluno1, 990001, 5, 1
)
ON DUPLICATE KEY UPDATE
    matricula = VALUES(matricula),
    semestre = VALUES(semestre),
    ativo = 1;


-- ALUNO 2
INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
)
VALUES (
    'Aluno Teste 2',
    'aluno.teste2@acolhe.local',
    '11999990005',
    @senha_hash,
    2,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_aluno2 = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'aluno.teste2@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_aluno2, 2)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO aluno (
    id_usuario, matricula, semestre, ativo
)
VALUES (
    @id_usuario_aluno2, 990002, 5, 1
)
ON DUPLICATE KEY UPDATE
    matricula = VALUES(matricula),
    semestre = VALUES(semestre),
    ativo = 1;


-- -----------------------------------------------------
-- 3. PACIENTE PARA TESTAR APROVAÇÃO
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
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
    id_usuario, nome_paciente, data_nascimento, ativo
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
-- 4. PACIENTE PARA TESTAR RECUSA
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
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
    id_usuario, nome_paciente, data_nascimento, ativo
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
-- 5. PACIENTES PARA TESTAR ATRIBUIÇÃO
-- -----------------------------------------------------

-- PACIENTE DE ATRIBUIÇÃO 1
INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
)
VALUES (
    'Paciente Teste Atribuicao 1',
    'paciente.atribuicao1@acolhe.local',
    '11999990006',
    @senha_hash,
    1,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_atribuicao1 = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'paciente.atribuicao1@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_atribuicao1, 1)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO paciente (
    id_usuario, nome_paciente, data_nascimento, ativo
)
VALUES (
    @id_usuario_atribuicao1,
    'Paciente Teste Atribuicao 1',
    '1994-03-10',
    1
)
ON DUPLICATE KEY UPDATE
    nome_paciente = VALUES(nome_paciente),
    data_nascimento = VALUES(data_nascimento),
    ativo = 1;

SET @id_paciente_atribuicao1 = (
    SELECT id_paciente
    FROM paciente
    WHERE id_usuario = @id_usuario_atribuicao1
);


-- PACIENTE DE ATRIBUIÇÃO 2
INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
)
VALUES (
    'Paciente Teste Atribuicao 2',
    'paciente.atribuicao2@acolhe.local',
    '11999990007',
    @senha_hash,
    1,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_atribuicao2 = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'paciente.atribuicao2@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_atribuicao2, 1)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO paciente (
    id_usuario, nome_paciente, data_nascimento, ativo
)
VALUES (
    @id_usuario_atribuicao2,
    'Paciente Teste Atribuicao 2',
    '1995-07-22',
    1
)
ON DUPLICATE KEY UPDATE
    nome_paciente = VALUES(nome_paciente),
    data_nascimento = VALUES(data_nascimento),
    ativo = 1;

SET @id_paciente_atribuicao2 = (
    SELECT id_paciente
    FROM paciente
    WHERE id_usuario = @id_usuario_atribuicao2
);

-- -----------------------------------------------------
-- 5.3. PACIENTE EXCLUSIVO PARA TESTAR AGENDAMENTO
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
)
VALUES (
    'Paciente Teste Agendamento',
    'paciente.agendamento@acolhe.local',
    '11999990008',
    @senha_hash,
    1,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_agendamento = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'paciente.agendamento@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_agendamento, 1)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO paciente (
    id_usuario, nome_paciente, data_nascimento, ativo
)
VALUES (
    @id_usuario_agendamento,
    'Paciente Teste Agendamento',
    '1993-08-15',
    1
)
ON DUPLICATE KEY UPDATE
    nome_paciente = VALUES(nome_paciente),
    data_nascimento = VALUES(data_nascimento),
    ativo = 1;

SET @id_paciente_agendamento = (
    SELECT id_paciente
    FROM paciente
    WHERE id_usuario = @id_usuario_agendamento
);

-- -----------------------------------------------------
-- 5.4. PACIENTE EXCLUSIVO PARA TESTAR PRÓXIMAS SESSÕES
-- -----------------------------------------------------

INSERT INTO usuario (
    nome_user, email_user, telefone, senha_user,
    id_papel, ativo
)
VALUES (
    'Paciente Teste Proximas Sessoes',
    'paciente.proximas@acolhe.local',
    '11999990009',
    @senha_hash,
    1,
    1
)
ON DUPLICATE KEY UPDATE
    nome_user = VALUES(nome_user),
    senha_user = VALUES(senha_user),
    id_papel = VALUES(id_papel),
    ativo = 1;

SET @id_usuario_proximas = (
    SELECT id_user
    FROM usuario
    WHERE email_user = 'paciente.proximas@acolhe.local'
);

INSERT INTO usuario_papel (id_usuario, id_papel)
VALUES (@id_usuario_proximas, 1)
ON DUPLICATE KEY UPDATE id_papel = VALUES(id_papel);

INSERT INTO paciente (
    id_usuario, nome_paciente, data_nascimento, ativo
)
VALUES (
    @id_usuario_proximas,
    'Paciente Teste Proximas Sessoes',
    '1991-06-20',
    1
)
ON DUPLICATE KEY UPDATE
    nome_paciente = VALUES(nome_paciente),
    data_nascimento = VALUES(data_nascimento),
    ativo = 1;

SET @id_paciente_proximas = (
    SELECT id_paciente
    FROM paciente
    WHERE id_usuario = @id_usuario_proximas
);

-- -----------------------------------------------------
-- 6. LIMPEZA DAS SOLICITAÇÕES DOS QUATRO PACIENTES
-- -----------------------------------------------------

-- Remove acompanhamentos relacionados.
DELETE FROM acompanhamentos
WHERE id_solicitacao IN (
    SELECT id_solicitacao
    FROM solicitacoes_atendimento
    WHERE id_paciente IN (
        @id_paciente_aprovacao,
        @id_paciente_recusa,
        @id_paciente_atribuicao1,
        @id_paciente_atribuicao2,
        @id_paciente_agendamento,
        @id_paciente_proximas
    )
);

-- Remove sessões relacionadas.
DELETE FROM sessao
WHERE id_solicitacao IN (
    SELECT id_solicitacao
    FROM solicitacoes_atendimento
    WHERE id_paciente IN (
        @id_paciente_aprovacao,
        @id_paciente_recusa,
        @id_paciente_atribuicao1,
        @id_paciente_atribuicao2,
        @id_paciente_agendamento,
        @id_paciente_proximas
    )
);

-- Remove as solicitações anteriores desses pacientes.
DELETE FROM solicitacoes_atendimento
WHERE id_paciente IN (
    @id_paciente_aprovacao,
    @id_paciente_recusa,
    @id_paciente_atribuicao1,
    @id_paciente_atribuicao2,
    @id_paciente_agendamento,
    @id_paciente_proximas
);

-- -----------------------------------------------------
-- 7. SOLICITAÇÕES PENDENTES PARA TESTAR TRIAGEM
-- -----------------------------------------------------

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

-- -----------------------------------------------------
-- 8. SOLICITAÇÕES APROVADAS PARA TESTAR ATRIBUIÇÃO
-- -----------------------------------------------------

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
    @id_paciente_atribuicao1,
    NULL,
    'Ansiedade',
    'Terça-feira, período da manhã',
    'Solicitação criada para testar a atribuição ao Aluno Teste 1.',
    'APROVADA'
),
(
    @id_paciente_atribuicao2,
    NULL,
    'Depressão',
    'Quinta-feira, período da tarde',
    'Solicitação criada para testar a atribuição ao Aluno Teste 2.',
    'APROVADA'
);

-- -----------------------------------------------------
-- 9. SOLICITAÇÃO EXCLUSIVA PARA TESTAR AGENDAMENTO
-- -----------------------------------------------------

SET @id_aluno_teste1 = (
    SELECT id_aluno
    FROM aluno
    WHERE id_usuario = @id_usuario_aluno1
);

INSERT INTO solicitacoes_atendimento (
    id_paciente,
    id_aluno,
    especialidade,
    horario_desejado,
    observacao_inicial,
    solicitacoes_status
)
VALUES (
    @id_paciente_agendamento,
    @id_aluno_teste1,
    'Ansiedade',
    'Disponibilidade para agendamento',
    'Solicitação criada exclusivamente para testar o agendamento de sessões.',
    'ASSUMIDA'
);


-- -----------------------------------------------------
-- 10. SESSÕES EXCLUSIVAS PARA TESTAR CONSULTA E ORDENAÇÃO
-- -----------------------------------------------------

INSERT INTO solicitacoes_atendimento (
    id_paciente,
    id_aluno,
    especialidade,
    horario_desejado,
    observacao_inicial,
    solicitacoes_status
)
VALUES (
    @id_paciente_proximas,
    @id_aluno_teste1,
    'Ansiedade',
    'Disponibilidade para acompanhamento',
    'Solicitação criada exclusivamente para testar a consulta de próximas sessões.',
    'ASSUMIDA'
);

SET @id_solicitacao_proximas = LAST_INSERT_ID();

-- Três sessões futuras para validar a ordenação.
INSERT INTO sessao (
    id_solicitacao,
    id_aluno,
    data_sessao,
    hora_inicio,
    hora_fim,
    observacao,
    status_sessao
)
VALUES
(
    @id_solicitacao_proximas,
    @id_aluno_teste1,
    DATE_ADD(CURDATE(), INTERVAL 35 DAY),
    '14:00:00',
    '15:00:00',
    'Segunda sessão de teste.',
    'AGENDADA'
),
(
    @id_solicitacao_proximas,
    @id_aluno_teste1,
    DATE_ADD(CURDATE(), INTERVAL 35 DAY),
    '10:00:00',
    '11:00:00',
    'Primeira sessão de teste.',
    'AGENDADA'
),
(
    @id_solicitacao_proximas,
    @id_aluno_teste1,
    DATE_ADD(CURDATE(), INTERVAL 40 DAY),
    '09:00:00',
    '10:00:00',
    'Terceira sessão de teste.',
    'AGENDADA'
);

UPDATE solicitacoes_atendimento
SET solicitacoes_status = 'EM_ATENDIMENTO'
WHERE id_solicitacao = @id_solicitacao_proximas;
