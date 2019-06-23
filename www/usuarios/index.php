<?php
require_once( $_SERVER["DOCUMENT_ROOT"] . '/Filtros.php'); 
require_once('Usuario.php');
// $usuario = new Usuario("201311546", "Muñoz", "Flores", "Victor Leopoldo", "viceo00@gmail.com", "estudiante");
// echo $usuario->Crear();

if(Filtros::REST_API())
{
    switch ($_SERVER['REQUEST_METHOD'])
    {
        //  GET /usuarios   (Obtener todos los usuarios)
        case 'GET':
            echo "GET?";
            $usuario = new Usuario();
            echo count($usuario->Obtener());
        break;
    }
}