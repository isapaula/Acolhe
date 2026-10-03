<?php

namespace App\Controller;

use App\Service\UsuarioService;
use App\Database\Conexao;
use App\Service\AlunoService;
use App\Service\PacienteService;
use App\Service\ProfessorService;


class AuthController
{
    public function paciente()
    {

        try {

            $pdo = Conexao::getConnection();
            $pdo->beginTransaction();

            $usuarioService = new UsuarioService($pdo);
            $pacienteService = new PacienteService($pdo);

            $dadosUsuario = $this->obterDadosUsuario();
            $this->validarDadosUsuario($dadosUsuario);

            $dadosPaciente = $this->obterDadosPaciente();

            $idUsuario = $usuarioService->criarUsuario($dadosUsuario, 1);

            $dados = [];

            $dados['id_usuario'] = $idUsuario;
            $dados['nome_paciente'] = $dadosUsuario['nome'];
            $dados['data_nascimento'] =  $dadosPaciente['data_nascimento'];
            $dados['telefone'] = $dadosPaciente['telefone'];

            $pacienteService->criar($dados);

            $pdo->commit();

            http_response_code(201);
            header('Content-Type: application/json');

            echo json_encode([
                'mensagem' => 'Paciente cadastrado com sucesso',
                'id' => $idUsuario
            ]);

            exit;

        } catch (\Exception $e) {

            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            http_response_code(400);
            header('Content-Type: application/json');

            echo json_encode([
                'erro' => $e->getMessage()
            ]);

        }
    }

    public function professor()
    {

        try {

            $pdo = Conexao::getConnection();
            $pdo->beginTransaction();

            $usuarioService = new UsuarioService($pdo);
            $professorService = new ProfessorService($pdo);

            $dadosUsuario = $this->obterDadosUsuario();
            $this->validarDadosUsuario($dadosUsuario);

            $dadosProfessor = $this->obterDadosProfessor();

            $idUsuario = $usuarioService->criarUsuario($dadosUsuario, 3);

            $dados = [];

            $dados['id_usuario'] = $idUsuario;
            $dados['registro_profissional'] = $dadosProfessor['rp'];

            $professorService->criar($dados);

            $pdo->commit();

            http_response_code(201);
            header('Content-Type: application/json');

            echo json_encode([
                'mensagem' => 'Professor cadastrado com sucesso',
                'id' => $idUsuario
            ]);

            exit;

        } catch (\Exception $e) {

            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            http_response_code(400);
            header('Content-Type: application/json');

            echo json_encode([
                'erro' => $e->getMessage()
            ]);
        }
    }

    public function aluno()
    {

        try {

            $pdo = Conexao::getConnection();
            $pdo->beginTransaction();

            $usuarioService = new UsuarioService($pdo);
            $alunoService   = new AlunoService($pdo);

            $dadosUsuario = $this->obterDadosUsuario();
            $this->validarDadosUsuario($dadosUsuario);

            $dadosAluno = $this->obterDadosAluno();

            $idUsuario = $usuarioService->criarUsuario($dadosUsuario, 2);

            $dados = [];

            $dados['id_usuario'] = $idUsuario;
            $dados['semestre'] =  $dadosAluno['semestre'];
            $dados['matricula'] = $dadosAluno['matricula'];

            $alunoService->criar($dados);

            $pdo->commit();

            http_response_code(201);
            header('Content-Type: application/json');

            echo json_encode([
                'mensagem' => 'Aluno cadastrado com sucesso',
                'id' => $idUsuario
            ]);
            exit;

        } catch (\Exception $e) {

            if ($pdo->inTransaction()) {

                $pdo->rollBack();
            }

            http_response_code(400);
            header('Content-Type: application/json');

            echo json_encode([
                'erro' => $e->getMessage()
            ]);
        }

    }

    // =========================
    // MÉTODOS AUXILIARES DE VALIDAÇÃO DOS DADOS
    // =========================

    private function obterDadosUsuario()
    {

         $dados = json_decode(file_get_contents('php://input'), true);

        return [
            'nome'  => $dados['nome'] ?? null,
            'email' => $dados['email'] ?? null,
            'senha' => $dados['senha'] ?? null,
        ];
    }

    private function validarDadosUsuario($dados)
    {
        if (empty($dados['nome']) || empty($dados['email']) || empty($dados['senha'])) {
            throw new \Exception("Campos obrigatórios não preenchidos");
        }

        if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
            throw new \Exception("E-mail inválido");
        }
    }

    private function obterDadosPaciente()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        $telefone = $dados['telefone'] ?? null;

        return [
            'data_nascimento' => $dados['data_nasc'] ?? null,
            'telefone'        => $this->limparTelefone($telefone)
        ];
    }

    private function obterDadosAluno()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        return [
            'matricula' => $dados['matricula'] ?? null,
            'semestre'  => $dados['semestre'] ?? null
        ];
    }

    private function obterDadosProfessor()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        return [
            'rp' => $dados['rp'] ?? null
        ];
    }

    private function limparTelefone($telefone)
    {
        return str_replace(['(', ')', '-', '.', ' '], '', $telefone);
    }

}
