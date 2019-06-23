<?php
require_once( $_SERVER["DOCUMENT_ROOT"] . '/Filtros.php'); 
Filtros::ArchivoPrivado();
require_once( $_SERVER["DOCUMENT_ROOT"] . '/db.php');

//  Modelo usuario
class Usuario extends DB
{
    private $password;
    public  $matricula, $apPaterno, $apMaterno, $nombre;
    public  $correoElectronico, $fotografia, $rol, $id;

    function __construct($matricula = '', $apPaterno = '', $apMaterno = '', $nombre = '', $rol = '', $correoElectronico = '', $password = null, $fotografia = null )
    {
        $this->matricula = $matricula;
        $this->apPaterno = $apPaterno;
        $this->apMaterno = $apMaterno;
        $this->nombre    = $nombre;
        $this->correoElectronico = $correoElectronico;
        $this->password = $password;
        $this->rol = $rol;
        $this->fotografia = $fotografia;

        $this->InicializarDB();
    }

    //  Obtener usuarios.
    //  Si se pasa el parametro $id, se regresa el indicado.
    public function Obtener($id = null)
    {
        //  Creamos query
        $query  = "SELECT id, ap_paterno, ap_materno, nombre, rol";
        $query .= ($id != null) ? ", matricula, correo_electronico, fotografia" : ""; // Concatenamos si existe $id
        $query .= " FROM usuarios";
        $query .= ($id != null) ? " WHERE id = ?" : "";                               // Concatenamos si existe $id
        $pdo = $this->ConectarDB();
        //  Iniciamos variable stm, por default es null.
        $stm;
        //  Si enviamos id numerico, preparamos el query con parametro
        if($id != null)
        {
            $stm = $pdo->prepare($query);
            $stm->execute([$id]);
        }
        //  De lo contrario solo hacemos una busqueda simple sin parametro
        else
        {
            $stm = $pdo->query($query);
        }  
        //  Inicializamos lista de resultados vacia
        $rows = [];
        //  Leemos resultados
        while($row = $stm->fetch())
        {
            //  Empujamos cada resultado dentro de la lista
            $rows[] = $row;
        }
        //  Creamos lista de usuarios vacia
        $usuarios = [];
        //  Recorremos los resultados
        foreach($rows as $row)
        {
            //  Asignamos cada resultado a un nuevo usuario 
            //  y lo empujamos dentro de la lista
            $usuario = new Usuario();
            $usuario->Asignar($row);
            $usuarios[] = $usuario;
        }
        //  Forzamos la destruccion del PDO
        $pdo = null;
        //  Si el numero de usuarios es mayor a 1 envia lista
        //  de lo contrario solo envia un objeto simple
        return count($usuarios) > 1 ? $usuarios : $usuarios[0];
    }

    public function Crear($password = null)
    {
        //  Hasheamos password si es enviado
        if($password != null) $this->HashearPassword($password);
        //  Creamos query
        $query  = "INSERT INTO usuarios SET ";
        $query .= "matricula          = ?,";
        $query .= "ap_paterno         = ?,";
        $query .= "ap_materno         = ?,";
        $query .= "nombre             = ?,";
        $query .= "correo_electronico = ?,";
        $query .= "fotografia         = ?,";
        $query .= "password           = ?,";
        $query .= "rol                = ? "; 
        //  Asignamos array de datos EN ORDEN
        $datos  = [
            $this->matricula,
            $this->apPaterno,
            $this->apMaterno,
            $this->nombre,
            $this->correoElectronico,
            $this->fotografia,
            $this->password,
            $this->rol
        ];
        //  Conectamos con la base de datos
        $pdo = $this->ConectarDB();
        //  Preparamos query para insercion de datos
        $stm = $pdo->prepare($query);
        //  Ejecutamos query con datos
        $stm->execute($datos);
        //  Obtenemos el ultimo id del registro insertado
        $lid = $pdo->lastInsertId();
        //  Asignamos null al $pdo para forzar su eliminacion
        $pdo = null;
        //  Regresamos el id del ultimo registro
        return $lid;
    }

    public function Actualizar($id, $password = null)
    {
        if($password != null) $this->HashearPassword($password);
        $query  = "UPDATE usuarios SET ";
        $query .= $this->matricula != null ? "matricula = ?," : "";
        $query .= $this->apPaterno != null ? "ap_paterno = ?," : "";
        $query .= $this->apMaterno != null ? "ap_materno = ?," : "";
        $query .= $this->nombre    != null ? "nombre = ?," : "";
        $query .= $this->correoElectronico != null ? "correo_electronico = ?," : "";
        $query .= $this->fotografia        != null ? "fotografia = ?," : "";
        $query .= $this->rol               != null ? "rol = ?," : "";
        $query .= $this->password          != null ? "password = ?," : "";
        $query  = rtrim($query, ','); // Eliminamos la ultima coma antes del WHERE
        $query .= " WHERE id = ?";
        $datos = [];
        if($this->matricula != null) $datos[] = $this->matricula;
        if($this->apPaterno != null) $datos[] = $this->apPaterno;
        if($this->apMaterno != null) $datos[] = $this->apMaterno;
        if($this->nombre    != null) $datos[] = $this->nombre;
        if($this->correoElectronico != null) $datos[] = $this->correoElectronico;
        if($this->fotografia != null) $datos[]        = $this->fotografia;
        if($this->rol != null) $datos[]               = $this->rol;
        if($this->password != null) $datos[]          = $this->password;
        $this->id = $id;
        $datos[]  = $id;

        $pdo = $this->ConectarDB();
        $stm = $pdo->prepare($query);
        $stm->execute($datos);
        $pdo = null;
    }

    public function Eliminar($id)
    {
        $query = "DELETE FROM usuarios WHERE id = ?";
        $pdo   = $this->ConectarDB();
        $smt   = $pdo->prepare($query);
        $smt->execute([$id]);
    }

    private function HashearPassword($password)
    {
        $this->password = password_hash($password, PASSWORD_BCRYPT);
    }

    private function Asignar($row)
    {
        //  Verificamos que las 'llaves' del array asociativo existan.
        $this->id = array_key_exists('id', $row) ? $row['id'] : null;
        $this->apPaterno = array_key_exists('ap_paterno', $row) ? $row['ap_paterno'] : null;
        $this->apMaterno = array_key_exists('ap_materno', $row) ? $row['ap_materno'] : null;
        $this->nombre = array_key_exists('nombre', $row) ? $row['nombre'] : null;
        $this->matricula = array_key_exists('matricula', $row) ? $row['matricula'] : null;
        $this->correoElectronico = array_key_exists('correo_electronico', $row) ? $row['correo_electronico'] : null;
        $this->fotografia = array_key_exists('fotografia', $row) ? $row['fotografia'] : null;
    }

    public function VerificarPassword($password)
    {
        // Falta implementar...
        $booleano = password_verify($password, $this->password);
    }
}