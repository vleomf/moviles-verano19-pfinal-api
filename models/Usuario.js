const db = require('../db');
const cc = require('camelcase-keys');
const bcrypt = require('bcrypt');

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

    async ObtenerTodos()
    {
        let query  = 'SELECT id, matricula, ap_paterno, ap_materno, nombre,';
            query += 'correo_electronico, fotografia, rol FROM usuarios'; 

        let conn;
        let rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query);
        }
        catch(e)
        {
            // console.log(err);
            return [{ error: 'db' }, {
                mensaje: 'Error al obtener los Usuarios'
            }];
        }
        finally
        {
            conn.end();
        }
        
        let usuarios = [];
        rows.forEach( row => {
            usuarios.push( new Usuario( cc(row) ) );
        })

        return [{ error: false }, usuarios];
    }

    async Obtener(id)
    {
        let query  = 'SELECT id, matricula, ap_paterno, ap_materno, nombre,';
            query += 'correo_electronico, fotografia, rol FROM usuarios WHERE id = ?';

        let conn;
        let rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [id]);
        }
        catch(e)
        {
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al obtener Usuario'
            }];
        }
        finally
        {
            conn.end();
        }

        return [{error: false}, rows[0] ? new Usuario(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if( !this.matricula || !this.apPaterno || !this.apMaterno || !this.nombre ||
            !this.correoElectronico || !this.rol ) return [{ error: 'usr' }, {
                matricula: this.matricula ? 'ok' : 'requerido',
                apPaterno: this.apPaterno ? 'ok' : 'requerido',
                apMaterno: this.apMaterno ? 'ok' : 'requerido',
                nombre:    this.nombre    ? 'ok' : 'requerido',
                correoElectronico : this.correoElectronico ? 'ok' : 'requerido',
                fotografia: this.fotografia ? 'ok' : 'opcional',
                rol: this.rol ? 'ok' : 'requerido < estudiante | profesor >',
                password: this.password ? 'ok' : 'opcional'
            }];

        let query  = 'INSERT INTO usuarios SET matricula = ?, ap_paterno = ?, ap_materno = ?,';
            query += 'nombre = ?, correo_electronico = ?, rol = ?,';
            query += this.fotografia ? 'fotografia = ?,' : '';
            query += this.password   ? 'password   = ?,' : '';
            query  = query.substring(0, query.length - 1);
        
        this.EncriptarPassword();
        let datos = [
            this.matricula, this.apPaterno,         this.apMaterno, 
            this.nombre,    this.correoElectronico, this.rol, 
            this.password,  this.fotografia
        ].filter(Boolean);

        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, datos);
        }
        catch(e)
        {
            // console.log(e);
            return [{ error : 'db' }, {
                mensaje: "Error al crear Usuario"
            }];
        }
        finally
        {
            conn.end();
        }

        this.password = undefined;
        return [{ error: false }, this];
    }

    async Actualizar(id)
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

        this.EncriptarPassword();
        let datos = [
            this.matricula,         this.apPaterno, this.apMaterno, this.nombre,
            this.correoElectronico, this.rol,       this.password,  this.fotografia, id
        ].filter(Boolean);

        console.log(query, datos);

        let conn;
        try
        {
            conn =  await db.Iniciar();
            await conn.query(query, datos);
        }
        catch(e)
        {
            console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al actualizar Usuario'
            }];
        }
        finally
        {
            conn.end();
        }

        this.password = undefined;
        return [{error: false}, this];
    }

    async Eliminar(id)
    {
        const query = "DELETE FROM usuarios WHERE id = ?";

        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, [id]);
        }
        catch(e)
        {
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al eliminar Usuario'
            }];
        }
        finally
        {
            conn.end();
        }
        return [{error: false}, {}];
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