<?php

namespace App\Router;

class Router
{
    public function dispatch(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

        // A raiz informa que este backend disponibiliza uma API.
        if ($uri === '/') {
            http_response_code(200);

            echo json_encode([
                'mensagem' => 'API Acolhe disponível.'
            ], JSON_UNESCAPED_UNICODE);

            return;
        }

        $partes = explode('/', trim($uri, '/'));

        // O Acolhe utiliza rotas no formato /controller/metodo.
        if (count($partes) !== 2) {
            $this->responderNaoEncontrado();
            return;
        }

        $controllerNome = ucfirst($partes[0]) . 'Controller';
        $controllerClasse = "App\\Controller\\{$controllerNome}";
        $metodo = $partes[1];

        // Verifica o arquivo antes de carregar a classe.
        // Isso evita a exceção do autoload para controllers inexistentes.
        $arquivoController = dirname(__DIR__)
            . DIRECTORY_SEPARATOR . 'Controller'
            . DIRECTORY_SEPARATOR . $controllerNome . '.php';

        if (!is_file($arquivoController)) {
            $this->responderNaoEncontrado();
            return;
        }

        require_once $arquivoController;

        // Confirma que o arquivo declarou a classe esperada.
        if (!class_exists($controllerClasse, false)) {
            $this->responderNaoEncontrado();
            return;
        }

        // Confirma que o método existe.
        if (!method_exists($controllerClasse, $metodo)) {
            $this->responderNaoEncontrado();
            return;
        }

        $reflexao = new \ReflectionMethod($controllerClasse, $metodo);

        // Não permite métodos privados, protegidos ou estáticos.
        if (!$reflexao->isPublic() || $reflexao->isStatic()) {
            $this->responderNaoEncontrado();
            return;
        }

        // Não permite chamar métodos herdados, como os da classe-base.
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
