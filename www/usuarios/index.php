<?php
require_once( $_SERVER["DOCUMENT_ROOT"] . '/Filtros.php'); 
require_once('Usuario.php');

if(Filtros::REST_API())
{
    switch ($_SERVER['REQUEST_METHOD'])
    {
        //  GET /usuarios      (Obtener todos los usuarios)
        //  GET /usuarios/$id  (Obtener un usuario con $id)
        case 'GET':
            //  Buscamos el ID en la URI
            $id = explode('/', $_SERVER['REQUEST_URI'])[2];
            $usuario = new Usuario();

            //  GET /usuarios/$id
            if(is_numeric($id) && $id != null)
            {
                try
                {
                    echo json_encode($usuario->Obtener($id));
                }
                catch(Exception $e)
                {
                    http_response_code(500);
                    echo json_encode([
                        'error' => 'Error al consultar Usuario'
                    ]);
                }
            }
            else if( !is_numeric($id) && $id != null)
            {
                //  Si el $id no es entero o su valor no es valido
                //  HTTP 400: Error de peticion de usuario
                http_response_code(400);
                echo json_encode([
                    'error' => '$id no valido en /usuarios/$id'
                ]);
            }
            //  GET /usuarios
            else
            {
                try
                {
                    echo json_encode($usuario->Obtener($id));
                }
                catch(Exception $e)
                {
                    http_response_code(500);
                    echo json_encode([
                        'error' => 'Error al consultar Usuarios',
                        'e' => $e
                    ]);
                }
            }
        break;

        //  POST /usuarios  (Creamos un nuevo usuario)
        case 'POST':
            //  Decodificamos datos peticion (enviados por body)
            $datosUsuario = json_decode( file_get_contents('php://input') );
            $usuario = new Usuario(
                $datosUsuario->matricula, 
                $datosUsuario->apPaterno, 
                $datosUsuario->apMaterno, 
                $datosUsuario->nombre,
                $datosUsuario->rol, 
                $datosUsuario->correoElectronico,
                $datosUsuario->fotografia);
            try
            {
                http_response_code(201);
                echo $usuario->Crear($datosUsuario->password);
            }
            catch(Exception $e)
            {
                http_response_code(500);
                echo json_encode([
                    'error' => 'Error al crear Usuario. Posibles datos nulos'
                ]);
            }
        break;

        //  PATCH /usuarios/$id  (Actualiza un usuario por $id)
        case 'PATCH':
            //  Buscamos el ID en la URI
            $id = explode('/', $_SERVER['REQUEST_URI'])[2];
            //  Decodificamos datos peticion (enviados por body)
            $datosUsuario = json_decode( file_get_contents('php://input') );
            $usuario = new Usuario(
                $datosUsuario->matricula, 
                $datosUsuario->apPaterno, 
                $datosUsuario->apMaterno, 
                $datosUsuario->nombre,
                $datosUsuario->rol, 
                $datosUsuario->correoElectronico,
                $datosUsuario->fotografia);

            if( $id != null && is_numeric($id) ) 
            {
                //  Peticion OK, comenzamos a 'parchar' el usuario
                try
                {
                    $usuario->Actualizar($id, $datosUsuario->password);
                    echo json_encode($usuario);
                }
                catch(Exception $e)
                {
                    http_response_code(500);
                    echo json_encode([
                        'error' => 'Error al actualizar Usuario'
                    ]);
                }
            }
            else
            {
                //  Si el $id no es entero o su valor no es valido
                //  HTTP 400: Error de peticion de usuario
                http_response_code(400);
                echo json_encode([
                    'error' => '$id no valido en /usuarios/$id'
                ]);
            }
        break;
        
        //  DELETE /usuarios/$id  (eliminar usuario por $id)
        case 'DELETE':
            //  Buscamos el ID en la URI
            $id = explode('/', $_SERVER['REQUEST_URI'])[2];
            $usuario = new Usuario();
            if( $id != null && is_numeric($id) ) 
            {
                try
                {
                    $usuario->Eliminar($id);
                }
                catch(Exception $e)
                {
                    http_response_code(500);
                    echo json_encode([
                        'error' => 'Error al actualizar Usuario'
                    ]);
                }
            }
            else
            {
                //  Si el $id no es entero o su valor no es valido
                //  HTTP 400: Error de peticion de usuario
                http_response_code(400);
                echo json_encode([
                    'error' => '$id no valido en /usuarios/$id'
                ]);   
            }
        break;
        
    }
}