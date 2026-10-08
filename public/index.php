<?php

use App\Router\Router;
use Dotenv\Dotenv;

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

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
