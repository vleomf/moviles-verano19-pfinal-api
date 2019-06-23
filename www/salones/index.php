<?php 

require_once( $_SERVER['DOCUMENT_ROOT'] . '/Filtros.php' );
require_once('Salon.php');

if(Filtros::REST_API())
{
    switch( $_SERVER['REQUEST_METHOD'])
    {
        //  GET /salones
        //  GET /salones/$id
        case 'GET':
            //  Busqueda de $id en URI
            $id = explode('/', $_SERVER['REQUEST_URI'])[2];
            $salon = new Salon();
            //  GET /salones/$id
            if(is_numeric($id) && $id != null)
            {
                try
                {
                    echo json_encode($salon->Obtener($id));
                }
                catch(Exception $e)
                {
                    http_response_code(500);
                    echo json_encode([
                        'error' => 'Error al consultar Salon'
                    ]);
                }
            }
            else if( !is_numeric($id) && $id != null )
            {
                //  Si el $id no es entero o su valor no es valido
                //  HTTP 400: Error de peticion de usuario
                http_response_code(400);
                echo json_encode([
                    'error' => '$id no valido en /salones/$id'
                ]);
            }
            //  GET /salones
            else
            {
                try
                {
                    echo json_encode($salon->Obtener());
                }
                catch(Exception $e)
                {
                    http_response_code(500);
                    echo json_encode([
                        'error' => 'Error al consultar Salones',
                        'e' => $e
                    ]);
                }
            }
        break;

        case 'POST':
            //  Decodificacion de body
            $datosSalon = json_decode( file_get_contents('php://input') );

        break;
    }
}