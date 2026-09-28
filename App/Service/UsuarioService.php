<?php

namespace App\Service;

class UsuarioService
{
    private $pdo; 

    
    public function __construct($pdo)
    {
        $this->pdo = $pdo; 
        
    }
    
    public function validacaoDados($dados){

        if (empty($dados['email'])) {

            throw new \Exception("Email não informado ou inválido! ");
            
        }

        if (empty($dados['nome'])) {

            throw new \Exception("Nome não informado! ");
            
        }

        if (empty($dados['senha'])) {
            
            throw new \Exception("Senha não informada! ");
            
        }

        $dados['email'] = filter_var($dados['email'], FILTER_SANITIZE_EMAIL);

        return $dados;

    }

    public function criarUsuario($dadosUsuario, $id_perfil)
    {

        $dadosUsuario = $this->validacaoDados($dadosUsuario); 

            $dadosUsuario['senha'] = password_hash($dadosUsuario['senha'], PASSWORD_DEFAULT);

            $sql = "INSERT INTO usuario (nome_user, email_user, senha_user, id_papel)
                        VALUES (:nome, :email, :senha, :perfil);";


    
            $stmtUser = $this->pdo->prepare($sql);

            $stmtUser->bindValue(':nome', $dadosUsuario['nome'], \PDO::PARAM_STR);
            $stmtUser->bindValue(':email', $dadosUsuario['email'], \PDO::PARAM_STR);
            $stmtUser->bindValue(':senha', $dadosUsuario['senha'], \PDO::PARAM_STR);
            $stmtUser->bindValue(':perfil', $id_perfil, \PDO::PARAM_INT);

            $stmtUser->execute();

    
            $idUsuario = $this->pdo->lastInsertId();
            
    

            return $idUsuario;


    }
}
