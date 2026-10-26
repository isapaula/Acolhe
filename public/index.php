<?php

use App\Router\Router;
use Dotenv\Dotenv;


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

require_once 'autoload.php';
require_once dirname(__DIR__, 1). '/vendor/autoload.php';

$path = dirname(__FILE__,2).'\\'; 


$dotenv = Dotenv::createImmutable($path);
$dotenv->safeLoad();

$router = new Router(); 
$router->dispatch();
