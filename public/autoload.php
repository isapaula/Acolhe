<?php

spl_autoload_register(function($classe){

    $path = dirname(__DIR__) . '/' . str_replace('\\', '/', $classe) . '.php';

        if(file_exists($path)){
            require_once $path;
        }else{

            throw new Exception("Arquivo: -- {$path} -- não encontrado! E Classe: -- {$classe} -- não encontrada !");
        }  
   
});