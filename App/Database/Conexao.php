<?php

namespace App\Database;

class Conexao
{
    public $host;
    public $db;
    public $user;
    public $pass;

    private static $instance = null;

    public static function getConnection()
    {

        $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? null);
        $db   = getenv('DB_DATABASE') ?: ($_ENV['DB_DATABASE'] ?? null);
        $user = getenv('DB_USERNAME') ?: ($_ENV['DB_USERNAME'] ?? null);
        $pass = getenv('DB_PASSWORD') ?: ($_ENV['DB_PASSWORD'] ?? null);

        if (self::$instance === null && isset($host, $db, $user, $pass)) {

            try {

                self::$instance = new \PDO("mysql:host=".$host.";dbname=". $db, $user, $pass);

                self::$instance->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

                self::$instance->exec("SET time_zone = '-03:00'");

            } catch (\PDOException $e) {

                die("Erro na conexão: " . $e->getMessage());
            }
        }
        return self::$instance;
    }

}
