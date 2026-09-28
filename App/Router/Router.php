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

        $controllerNome = !empty($partes[0])
            ? ucfirst($partes[0]) . 'Controller'
            : 'HomeController';

        $metodo = $partes[1] ?? 'index';

        $controllerClasse = "App\\Controller\\{$controllerNome}";

        if (!class_exists($controllerClasse) || !method_exists($controllerClasse, $metodo)) {
            http_response_code(404);
            echo "404 - Página não encontrada!";
            return;
        }

        $controller = new $controllerClasse();

        $controller->$metodo();
    }
}
