<?php
//  LEER ARCHIVO CONFIGURACION
$ini = parse_ini_file('config.ini');

//  INICIALIZAR CONSTANTES GLOBALES
define('DB_HOST', $ini['db_host']);
define('DB_PORT', $ini['db_port']);
define('DB_NAME', $ini['db_name']);
define('DB_USER', $ini['db_user']);
define('DB_PASS', $ini['db_pass']);
