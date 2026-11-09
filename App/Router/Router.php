<?php

namespace App\Router;

class Router
{
    public function dispatch(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);


        if ($uri === '/') {
            http_response_code(200);

            echo json_encode([
                'mensagem' => 'API Acolhe disponível.'
            ], JSON_UNESCAPED_UNICODE);

            return;
        }

        $partes = explode('/', trim($uri, '/'));


        if (count($partes) !== 2) {
            $this->responderNaoEncontrado();
            return;
        }

        $controllerNome = ucfirst($partes[0]) . 'Controller';
        $controllerClasse = "App\\Controller\\{$controllerNome}";
        $metodo = $partes[1];

        $arquivoController = dirname(__DIR__)
            . DIRECTORY_SEPARATOR . 'Controller'
            . DIRECTORY_SEPARATOR . $controllerNome . '.php';

        if (!is_file($arquivoController)) {
            $this->responderNaoEncontrado();
            return;
        }

        require_once $arquivoController;


        if (!class_exists($controllerClasse, false)) {
            $this->responderNaoEncontrado();
            return;
        }


        if (!method_exists($controllerClasse, $metodo)) {
            $this->responderNaoEncontrado();
            return;
        }

        $reflexao = new \ReflectionMethod($controllerClasse, $metodo);

        if (!$reflexao->isPublic() || $reflexao->isStatic()) {
            $this->responderNaoEncontrado();
            return;
        }

        if ($reflexao->getDeclaringClass()->getName() !== $controllerClasse) {
            $this->responderNaoEncontrado();
            return;
        }

        $controller = new $controllerClasse();

        $controller->$metodo();
    }

    private function responderNaoEncontrado(): void
    {
        http_response_code(404);

        echo json_encode([
            'erro' => 'Rota não encontrada.'
        ], JSON_UNESCAPED_UNICODE);
    }
}
