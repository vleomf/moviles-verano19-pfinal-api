<?php
require_once( $_SERVER["DOCUMENT_ROOT"] . '/Filtros.php'); 
Filtros::ArchivoPrivado();
require_once( $_SERVER["DOCUMENT_ROOT"] . '/db.php');

//  Modelo usuario
class Usuario extends DB
{
    private $id;
    public $matricula, $apPaterno, $apMaterno, $nombre;
    public $correoElectronico, $fotografia, $rol;

    function __construct($matricula = '', $apPaterno = '', $apMaterno = '', $nombre = '', $correoElectronico = '', $rol = '', $fotografia = null )
    {
        $this->matricula = $matricula;
        $this->apPaterno = $apPaterno;
        $this->apMaterno = $apMaterno;
        $this->nombre    = $nombre;
        $this->correoElectronico = $correoElectronico;
        $this->rol = $rol;
        $this->fotografia = $fotografia;

        $this->InicializarDB();
    }

    public function Obtener($id = null)
    {
        $query  = "SELECT id, ap_paterno, ap_materno, nombre, rol";
        $query .= ($id != null) ? ", matricula, correo_electronico, fotografia" : "";
        $query .= " FROM usuarios";
        $query .= ($id != null) ? " WHERE id = ?" : "";
        $pdo = $this->ConectarDB();
        $stm;
        if($id != null)
        {
            $stm = $pdo->prepare($query);
            $stm->execute([$id]);
        }
        else
        {
            $stm = $pdo->query($query);
        }
        $rows = $stm->fetch();
        $pdo = null;
        return ($id == null) ? $rows : $rows[0];
    }

    public function Crear()
    {
        $query  = "INSERT INTO usuarios SET ";
        $query .= "matricula          = ?,";
        $query .= "ap_paterno         = ?,";
        $query .= "ap_materno         = ?,";
        $query .= "nombre             = ?,";
        $query .= "correo_electronico = ?,";
        $query .= "fotografia         = ?,";
        $query .= "rol                = ? "; 
        $datos  = [
            $this->matricula,
            $this->apPaterno,
            $this->apMaterno,
            $this->nombre,
            $this->correoElectronico,
            $this->fotografia,
            $this->rol
        ];
        $pdo = $this->ConectarDB();
        $stm = $pdo->prepare($query);
        $stm->execute($datos);
        $lid = $pdo->lastInsertId();
        $pdo = null;
        return $lid;
    }
}