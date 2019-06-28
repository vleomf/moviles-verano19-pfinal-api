const db = require('../db');
const cc = require('camelcase-keys');
const bcrypt = require('bcrypt');

/**
 * Def. clase Usuario
 * @type  {Usuario}
 * @requires
 * @param {string} matricula            Matricula de usuario
 * @param {string} apPaterno            Apellido paterno de usuario
 * @param {string} apMaterno            Apellido materno de usuario
 * @param {string} nombre               Nombre de usuario
 * @param {string} correoElectronico    Correo Electronico de usuario
 * @param {Rol}    rol                  Rol de usuario
 * @param {string} password             Contraseña de usuario
 * 
 * @optionals
 * @param {string} fotografia           Url de fotografia de usuario
 * 
 * Def. enum Rol
 * @enum  {Rol}
 * @valores 
 *  {string} estudiante
 *  {string} profesor 
 */

class Usuario
{

    constructor(u)
    {
        if(!u) return;
        this.id                = u.id;
        this.matricula         = u.matricula;
        this.apPaterno         = u.apPaterno;
        this.apMaterno         = u.apMaterno;
        this.nombre            = u.nombre;
        this.correoElectronico = u.correoElectronico;
        this.rol               = u.rol;
        this.password          = u.password;
        this.fotografia        = u.fotografia;
    }

    static async ObtenerTodos()
    {
        let query  = 'SELECT id, matricula, ap_paterno, ap_materno, nombre,';
            query += 'correo_electronico, fotografia, rol, password FROM usuarios'; 

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query);
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo  : 'N',
                    ofensa: false
                }, null];
                default             : return [{
                    codigo: 'E-1000',
                    tipo  : 'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        
        let usuarios = [];
        rows.forEach( row => {
            usuarios.push( new Usuario( cc(row) ) );
        })

        return [false , usuarios];
    }

    static async Obtener(id)
    {
        let query  = 'SELECT id, matricula, ap_paterno, ap_materno, nombre,';
            query += 'correo_electronico, fotografia, rol, password FROM usuarios WHERE id = ?';

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [id]);
            if(!rows.length) return [false, null];
        }
        catch(e)
        {
            // console.log(e)
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo: 'N',
                    ofensa: false
                }, null];
                default : return [{
                    codigo: 'E-1000',
                    tipo: 'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }

        return [false , new Usuario(cc(rows[0])) ];
    }

    static async ObtenerPorCorreo(correoElectronico)
    {
        let query  = 'SELECT id, matricula, ap_paterno, ap_materno, nombre, password,';
            query += 'correo_electronico, fotografia, rol FROM usuarios WHERE correo_electronico = ?';

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [correoElectronico]);
            if(!rows.length) return[false, null];
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo: 'N',
                    ofensa: false
                }, null];
                default : return [{
                    codigo: 'E-1000',
                    tipo: 'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }

        return [false, new Usuario(cc(rows[0]))] ;
    }

    static async ObtenerPorMatricula(matricula)
    {
        let query  = 'SELECT id, matricula, ap_paterno, ap_materno, nombre, password,';
            query += 'correo_electronico, fotografia, rol FROM usuarios WHERE matricula = ?'; 

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, matricula);
            if(!rows.length) return [false, null];
        }
        catch(e)
        {
            console.log(e);
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo: 'N',
                    ofensa: false
                }, null];
                default : return [{
                    codigo: 'E-1000',
                    tipo: 'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }

        return[false, new Usuario(cc(rows[0]))];
    }

    async Crear()
    {
        if( !this.matricula || !this.apPaterno || !this.apMaterno || !this.nombre ||
            !this.correoElectronico || !this.rol || !this.password) return [{
                codigo: 'U-1000',
                tipo:   'U',
                ofensa: {
                    requeridos: {
                        matricula: this.matricula ? true : false,
                        apPaterno: this.apPaterno ? true : false,
                        apMaterno: this.apMaterno ? true : false,
                        nombre   : this.nombre    ? true : false,
                        correoElectronico : this.correoElectronico ? true : false,
                        rol: this.rol ? true : false,
                        password: this.password ? true : false
                    },
                    opcionales: ['fotografia']
                }
            }, null];

        let query  = 'INSERT INTO usuarios SET matricula = ?, ap_paterno = ?, ap_materno = ?,';
            query += 'nombre = ?, correo_electronico = ?, rol = ?, password = ?,';
            query += this.fotografia ? 'fotografia = ?,' : '';
            query  = query.substring(0, query.length - 1);
        
        this.EncriptarPassword();
        let datos = [
            this.matricula, this.apPaterno,         this.apMaterno, 
            this.nombre,    this.correoElectronico, this.rol, 
            this.password,  this.fotografia
        ].filter(Boolean);

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, datos);
            this.id = rows.insertId;
        }
        catch(e)
        {
            console.log(e);
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo:   'N',
                    ofensa: false
                }, null];
                default: return [{
                    codigo: 'E-1000',
                    tipo:   'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        return [false, null];
    }

    async Actualizar()
    {
        let query  = 'UPDATE usuarios SET ';
            query += this.matricula ? 'matricula = ?,' : '';
            query += this.apPaterno ? 'ap_paterno = ?,' : '';
            query += this.apMaterno ? 'ap_materno = ?,' : '';
            query += this.nombre    ? 'nombre = ?,' : '';
            query += this.correoElectronico ? 'correo_electronico = ?,' : '';
            query += this.rol       ? 'rol = ?,' : '';
            query += this.password  ? 'password = ?,' : '';
            query += this.fotografia? 'fotografia = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?';
            
        let query2  = 'SELECT id, matricula, ap_paterno, ap_materno, nombre, ';
            query2 += 'correo_electronico, rol, password, fotografia FROM usuarios';
            query2 += ' WHERE id = ?';

        this.EncriptarPassword();
        let datos = [
            this.matricula,         this.apPaterno, this.apMaterno, this.nombre,
            this.correoElectronico, this.rol,       this.password,  this.fotografia].filter(Boolean);

        if(!datos.length) return [{
            codigo: 'U-1000',
            tipo:   'U',
            ofensa: {
                enviados: 0,
                disponibles: Object.keys(this).filter(el => { return el != 'id' ? el : undefined })
            }
        }, null];

        datos.push(this.id);
        
        let conn;
        try
        {
            conn =  await db.Iniciar();
            await conn.query(query, datos);

            const datosActualizados = await conn.query(query2, this.id);
            this.matricula  = datosActualizados[0]['matricula'];
            this.apPaterno  = datosActualizados[0]['ap_paterno'];
            this.apMaterno  = datosActualizados[0]['ap_materno'];
            this.nombre     = datosActualizados[0]['nombre'];
            this.rol        = datosActualizados[0]['rol'];
            this.password   = datosActualizados[0]['password'];
            this.fotografia = datosActualizados[0]['fotografia'];
            this.correoElectronico = datosActualizados[0]['correo_electronico'];
        }
        catch(e)
        {
            console.log(e);
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo:   'N',
                    ofensa:  false
                }, null];
                default : return [{
                    codigo: 'E-1000',
                    tipo:   'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        return [false, null];
    }

    async Eliminar()
    {
        const query = "DELETE FROM usuarios WHERE id = ?";

        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, [this.id]);
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo:   'N',
                    ofensa: false
                }, null]
                default : return [{
                    codigo: 'E-1000',
                    tipo:   'E',
                    ofensa: false
                }, null]
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        return [false, null];
    }

    async EncriptarPassword()
    {
        if(this.password)
        {
            this.password = bcrypt.hashSync(this.password, 10);
        }
    }
    async ValidarPassword(hashpass)
    {
       return bcrypt.compareSync(this.password, hashpass);
    }
}

module.exports = Usuario