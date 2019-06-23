/// DEFINICION DE MODELO USUARIO.

/// LOS PARAMETROS CORRESPONDEN AL CONSTRUCTOR.
/// SE PUEDEN ASIGNAR VALORES POR DEFAULT
/// PARA QUE EL CONSTRUCTOR SEA FLEXIBLE.
/// EJEMPLO:

///     matricula         -> ES UN PARAMETRO REQUERIDO
///     apPaterno         -> ES UN PARAMETRO REQUERIDO
///     apMaterno         -> ES UN PARAMETRO REQUERIDO
///     nombre            -> ES UN PARAMETRO REQUERIDO
///     correoElectronico -> ES UN PARAMETRO REQUERIDO
///     fotografia        -> ES UN PARAMETRO CON VALOR POR DEFAULT (ES POSIBLE NO INCLUIRLO EN EL CONSTRUCTOR)
///     rol               -> ES UN PARAMETRO CON VALOR POR DEFAULT (EL ROL POR DEFAULT SERA `estudiante`)

/// A PARTIR DE ES6, EXISTE LA PALABRA RESERVADA CLASS 
/// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

class Usuario
{
    constructor(matricula, apPaterno, apMaterno, nombre, correoElectronico, fotografia = null, rol = 'estudiante')
    {
        /// INICIALIZAMOS ATRIBUTOS
        this.matricula = matricula;
        this.apPaterno = apPaterno;
        this.apMaterno = apMaterno;
        this.nombre = nombre;
        this.correoElectronico = correoElectronico;
        this.fotografia = fotografia;
        this.rol = rol;
    }

    /// DEFINICION DE METODOS
    Saludar()
    {
        return `Hola soy ${this.nombre} ${this.apPaterno} ${this.apMaterno}`;
    }
}

/// EXPORTAMOS LA CLASE USUARIO. TODO EN NODE JS ES UN MODULO QUE 
/// PUEDE SER IMPORTADO EN OTRO ARCHIVO.
module.exports = Usuario 