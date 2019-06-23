<?php  require_once( $_SERVER["DOCUMENT_ROOT"] . '/Filtros.php'); 
//  Si la peticion contiene la cabecera que
//  detecta si la peticion es una llamada REST desde nuestra 
//  app movil, entonces regresamos el codigo 404
?>
<?php if(Filtros::REST_API()): http_response_code(404) ?>
<?php else: ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>404 - No Encontrado</title>
</head>
<body>
    <!-- AQUI SE MAQUETARA LA PAGINA 404 -->
    <h1>404 - No Encontrado</h1>
</body>
</html>
<?php endif ?>