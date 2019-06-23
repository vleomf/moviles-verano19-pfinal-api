<?php
require_once('Filtros.php');
Filtros::ArchivoPrivado();
require_once( $_SERVER['DOCUMENT_ROOT'] . '/../config/config.php' );

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