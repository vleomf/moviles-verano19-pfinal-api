/// DEFINICION DE MODELO USUARIO.

/// LOS PARAMETROS CORRESPONDEN AL CONSTRUCTOR.

/// A PARTIR DE ES6, EXISTE LA PALABRA RESERVADA CLASS 
/// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

class Usuario
{
    constructor(matricula, apPaterno, apMaterno, nombre, correoElectronico, fotografia, rol)
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