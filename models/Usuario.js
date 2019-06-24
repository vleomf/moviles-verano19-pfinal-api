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

    async Obtener(id)
    {
        const query = `
        SELECT id, matricula, ap_paterno, ap_materno, nombre,
        correo_electronico, fotografia, rol FROM usuarios`;
        if(id) query += `WHERE id = ?`;

        let rows;
        try
        {
            const conn = await db.Iniciar();
            rows = await conn.query(query, [id]);
        }
        catch(e)
        {
            // console.log(err);
            return [{ error: 'db' }, {
                mensaje: `Error al obtener Usuario${id != null ? 's' : ''}`
            }];
        }
        
        let usuarios = [];
        rows.forEach( row => {
            usuarios.push( new Usuario( cc(row) ) );
        })

        return [{ error: false }, usuarios];
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
                rol: this.rol ? 'ok' : 'requerido',
                password: this.password ? 'ok' : 'opcional'
            }];

        let query = `
        INSERT INTO usuarios SET 
        matricula          = ?, ap_paterno         = ?, ap_materno         = ?,
        nombre             = ?, correo_electronico = ?, rol                = ?,`;
        query += this.fotografia ? 'fotografia = ?,' : '';
        query += this.password   ? 'password   = ?,' : '';
        query  = query.substring(0, query.length - 1);

        let datos = [
            this.matricula, this.apPaterno,         this.apMaterno, 
            this.nombre,    this.correoElectronico, this.rol, 
            this.password,  this.fotografia
        ].filter( el => { return el !== undefined ? el : '' });

        let res;
        try
        {
            const conn = await db.Iniciar();
            res = await conn.query(query, datos);
        }
        catch(e)
        {
            // console.log(e);
            return [{ error : 'db' }, {
                mensaje: "Error al crear Usuario"
            }];
        }
        return [{ error: false }, res];
    }

    async Actualizar($id)
    {

    }
}

module.exports = Usuario