<?php  require_once( $_SERVER["DOCUMENT_ROOT"] . '/Filtros.php'); 
//  Si la peticion contiene la cabecera que
//  detecta si la peticion es una llamada REST desde nuestra 
//  app movil, entonces regresamos el codigo 404
?>
<?php if(Filtros::REST_API()): http_response_code(401) ?>
<?php else: ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>401 - No Autorizado</title>
</head>
<body>
    <!-- AQUI SE MAQUETARA LA PAGINA 401 -->
    <h1>401 - No Autorizado</h1>
</body>
</html>
<?php endif ?>