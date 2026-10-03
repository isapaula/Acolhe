<?php 

namespace App\Api;

use App\Database\Conexao;

class UsuarioApiController {

    public function index (){

        $pdo = Conexao::getConnection(); 

        $sql = "SELECT nome_user, email_user, id_papel FROM usuario; ";
        
        $result = $pdo->query($sql); 
        
        $pacientes = $result->fetchAll(\PDO::FETCH_ASSOC); 

        if (is_array($pacientes)) {

           $json = json_encode($pacientes);

        }

        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: http://localhost:3000');

        echo $json;
    }

}