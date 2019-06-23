<?php
//  Filtro para denegar ejecucion de archivo por cliente.
//  Solo el servidor puede ejectuar un archivo con este filtro.
if( count( get_included_files() ) == 1 )
{
    http_response_code(401);
    echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/error/401.php');
    die();
}


//  LEER ARCHIVO CONFIGURACION
$ini = parse_ini_file($_SERVER['DOCUMENT_ROOT'] .'/../config/config.ini');

//  INICIALIZAR CONSTANTES GLOBALES
define('DB_HOST', $ini['db_host']);
define('DB_PORT', $ini['db_port']);
define('DB_NAME', $ini['db_name']);
define('DB_USER', $ini['db_user']);
define('DB_PASS', $ini['db_pass']);

Class DB
{   
    private $dns;
    private $user, $pass;
    private $options;

    protected function InicializarDB()
    {
        $this->dns  = "mysql:dbname=" . DB_NAME .";";
        $this->dns .= "host=" . DB_HOST . ";";
        $this->dns .= "port=" . DB_PORT . ";";
        $this->dns .= "charset=utf8";
        $this->user = DB_USER;
        $this->pass = DB_PASS;
        $this->options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
    }

    protected function ConectarDB()
    {
        return new PDO($this->dns, $this->user, $this->pass, $this->options);
    }
}