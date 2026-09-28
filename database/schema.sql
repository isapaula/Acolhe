DROP DATABASE IF EXISTS  clinica; 
CREATE DATABASE clinica;
USE clinica; 

DROP TABLE IF EXISTS `papeis`;
CREATE TABLE `papeis` (
  `id_papel` int NOT NULL AUTO_INCREMENT,
  `nome_papel` enum('PACIENTE','ALUNO','PROFESSOR','GESTAO') NOT NULL,
  PRIMARY KEY (`id_papel`),
  UNIQUE KEY `nome_papel` (`nome_papel`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `papeis` VALUES (1,'PACIENTE'),(2,'ALUNO'),(3,'PROFESSOR'),(4,'GESTAO');

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nome_user` varchar(200) NOT NULL,
  `email_user` varchar(100) NOT NULL,
  `senha_user` varchar(255) NOT NULL,
  `id_papel` int DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email_user` (`email_user`),
  KEY `fk_id_papel` (`id_papel`),
  CONSTRAINT `fk_id_papel` FOREIGN KEY (`id_papel`) REFERENCES `papeis` (`id_papel`),
  CONSTRAINT `email_nao_vazio` CHECK ((`email_user` <> _utf8mb4'')),
  CONSTRAINT `nome_nao_vazio` CHECK ((`nome_user` <> _utf8mb4'')),
  CONSTRAINT `senha_nao_vazio` CHECK ((`senha_user` <> _utf8mb4''))
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `usuario_papel`;
CREATE TABLE `usuario_papel` (
  `id_usuario` int NOT NULL,
  `id_papel` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_papel`),
  KEY `fk_up_papel` (`id_papel`),
  CONSTRAINT `fk_up_papel` FOREIGN KEY (`id_papel`) REFERENCES `papeis` (`id_papel`),
  CONSTRAINT `fk_up_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `paciente`;
CREATE TABLE `paciente` (
  `id_paciente` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nome_paciente` varchar(50) DEFAULT NULL,
  `data_nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `observacoes_iniciais` varchar(200) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_paciente`),
  UNIQUE KEY `uk_paciente_usuario` (`id_usuario`),
  CONSTRAINT `fk_paciente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_user`),
  CONSTRAINT `telefone_nao_vazio` CHECK ((`telefone` <> _utf8mb4''))
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `aluno`;
CREATE TABLE `aluno` (
  `id_aluno` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `matricula` int NOT NULL,
  `semestre` int NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_aluno`),
  UNIQUE KEY `uk_aluno_usuario` (`id_usuario`),
  CONSTRAINT `fk_aluno_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `professor`;
CREATE TABLE `professor` (
  `id_professor` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `registro_profissional` varchar(200) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_professor`),
  UNIQUE KEY `uk_professor_usuario` (`id_usuario`),
  CONSTRAINT `fk_professor_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `solicitacoes_atendimento`;
CREATE TABLE `solicitacoes_atendimento` (
  `id_solicitacao` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_aluno` int DEFAULT NULL,
  `especialidade` varchar(100) NOT NULL,
  `horario_desejado` varchar(100) DEFAULT NULL,
  `observacao_inicial` text,
  `solicitacoes_status` enum('AGUARDANDO_TRIAGEM','ASSUMIDA','APROVADA','RECUSADA','EM_ATENDIMENTO') DEFAULT 'AGUARDANDO_TRIAGEM',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_solicitacao`),
  KEY `fk_solicitacao_paciente` (`id_paciente`),
  CONSTRAINT `fk_solicitacao_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `sessao`;
CREATE TABLE `sessao` (
  `id_sessao` int NOT NULL AUTO_INCREMENT,
  `id_solicitacao` int NOT NULL,
  `id_aluno` int NOT NULL,
  `data_sessao` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  `observacao` varchar(100) DEFAULT NULL,
  `status_sessao` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_sessao`),
  KEY `fk_up_solicitacao` (`id_solicitacao`),
  KEY `fk_up_aluno` (`id_aluno`),
  CONSTRAINT `fk_up_aluno` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  CONSTRAINT `fk_up_solicitacao` FOREIGN KEY (`id_solicitacao`) REFERENCES `solicitacoes_atendimento` (`id_solicitacao`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `acompanhamentos`;
CREATE TABLE `acompanhamentos` (
  `id_acompanhamento` int NOT NULL AUTO_INCREMENT,
  `id_solicitacao` int NOT NULL,
  `id_paciente` int NOT NULL,
  `id_aluno` int NOT NULL,
  `id_professor` int DEFAULT NULL,
  `data_inicio` date NOT NULL,
  `status` enum('ATIVO','ENCERRADO','INTERROMPIDO') NOT NULL DEFAULT 'ATIVO',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_acompanhamento`),
  KEY `fk_acomp_solicitacao` (`id_solicitacao`),
  KEY `fk_acomp_paciente` (`id_paciente`),
  KEY `fk_acomp_aluno` (`id_aluno`),
  KEY `fk_acomp_professor` (`id_professor`),
  CONSTRAINT `fk_acomp_aluno` FOREIGN KEY (`id_aluno`) REFERENCES `aluno` (`id_aluno`),
  CONSTRAINT `fk_acomp_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`),
  CONSTRAINT `fk_acomp_professor` FOREIGN KEY (`id_professor`) REFERENCES `professor` (`id_professor`),
  CONSTRAINT `fk_acomp_solicitacao` FOREIGN KEY (`id_solicitacao`) REFERENCES `solicitacoes_atendimento` (`id_solicitacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;