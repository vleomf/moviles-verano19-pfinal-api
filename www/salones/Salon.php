<?php
require_once( $_SERVER['DOCUMENT_ROOT'] . '/db.php');
//  Filtro para denegar ejecucion de archivo por cliente.
//  Solo el servidor puede ejectuar un archivo con este filtro.
if( count( get_included_files() ) == 2 )
{
    http_response_code(401);
    echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/error/401.php');
    die();
}

//Modelo Salon
class Salon extends DB
{
    public $id, $curso, $codigo, $edificio ;
    public $facultad, $institucion;
    private $latitud, $longitud;

    function __construct(    $curso  = '', $codigo  = '', $edificio   = '',
        $facultad = '', $institucion = '', $latitud = null, $longitud = null )
    {
        $this->curso    = $curso;
        $this->codigo   = $codigo;
        $this->edificio = $edificio;
        $this->facultad = $facultad;
        $this->institucion = $institucion;
        $this->latitud  = $latitud;
        $this->longitud = $longitud;

        $this->InicializarDB();
    }

    //  Obtener salones
    public function Obtener($id = null)
    {
        $query  = "SELECT id, curso, codigo, edificio, facultad, institucion";
        $query .= ($id != null) ? ", latitud, longitud" : "";
        $query .= " FROM salones";
        $query .= ($id != null) ? " WHERE id = ?" : "";
        
        $pdo = $this->ConectarDB();
        $stm; // Statement

        if($id != null)
        {
            $stm = $pdo->prepare($query);
            $stm->execute([$id]);
        }
        else
        {
            $stm = $pdo->query($query);
        }

        $rows = [];
        while($row = $stm->fetch())
        {
            $rows[] = $row;
        }

        $salones = [];
        foreach($rows as $row)
        {
            $salon = new Salon();
            $salon->Asignar($row);
            $salones[] = $salon;
        }

        $pdo = null;
        return $salones;
    }

    private function Asignar($row)
    {
        $this->id = array_key_exists('id', $row) ? $row['id'] : null;
        $this->curso = array_key_exists('curso', $row) ? $row['curso'] : null;
        $this->codigo = array_key_exists('codigo', $row) ? $row['codigo'] : null;
        $this->edificio = array_key_exists('edificio', $row) ? $row['edificio'] : null;
        $this->facultad = array_key_exists('facultad', $row) ? $row['facultad'] : null;
        $this->institucion = array_key_exists('institucion', $row) ? $row['institucion'] : null;
        $this->latitud = array_key_exists('latitud', $row) ? $row['latitud'] : null;
        $this->longitud = array_key_exists('longitud', $row) ? $row['longitud'] : null;
    }
}