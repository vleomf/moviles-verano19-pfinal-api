<?php
//  Clase con metodos abstractos que definiran 
//  filtros dentro de nuestra aplicacion
abstract class Filtros
{
    //  Filtro para denegar ejecucion de archivo por cliente.
    //  Solo el servidor puede ejectuar un archivo con este filtro.
    static function ArchivoPrivado()
    {
        if( count( get_included_files() ) == 1 )
        {
            http_response_code(401);
            echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/error/401.php');
            die();
        }
    }

    //  Filtro para modificar la respuesta en servidor. 
    //  Si se cuenta con la cabecera 'PETICION-REST'
    //  la respuesta se adecua a nuestra aplicacion movil.
    static function REST_API()
    {   
        return isset($_SERVER['HTTP_PETICION_REST']) ? true : false;
    } 
}

//  Declaramos este mismo archivo como privado
//  por cuestiones de seguridad
Filtros::ArchivoPrivado();