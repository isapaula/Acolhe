<?php

namespace App\Router;

class Router
{
    public function dispatch()
    {
        $uri = $_SERVER['REQUEST_URI'];

        $uri = strtok($uri, '?');

        //var_dump($uri);

        $base = '/';

        $partes = explode('/', trim($uri, '/'));

        if ($partes[0] == 'api') {
            
            $controllerNome = ucfirst($partes[1]) .'Api'. 'Controller';

            $controllerClasse = "App\\Api\\{$controllerNome}";

            $metodo = $partes[2] ?? 'index';

        }else{

            $controllerNome = !empty($partes[0])
            ? ucfirst($partes[0]) . 'Controller'
            : 'HomeController';

            $controllerClasse = "App\\Controller\\{$controllerNome}";

            $metodo = $partes[1] ?? 'index';

        }

    
        if (!class_exists($controllerClasse) || !method_exists($controllerClasse, $metodo)) {
            http_response_code(404);
            echo "404 - Página não encontrada!";
            return;
        }

        $controller = new $controllerClasse();

        $controller->$metodo();
    }
}
