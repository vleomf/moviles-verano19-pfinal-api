const db = require('../db');
const cc = require('camelcase-keys');

class Asistente
{
    constructor(a)
    {
        if(!a) return;
        this.id = a.id;
        this.usuario = a.usuario;
        this.curso = a.curso;
    }

    async ObtenerTodos()
    {
        const query = 'SELECT id, usuario, curso FROM asistentes';
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query);
        }
        catch(e)
        {
            // console.log(e);
            return ['db', []];
        }
        finally
        {
            conn.end();
        }
        let asistentes = [];
        rows.forEach( row => {
            asistentes.push( new Asistente( cc(row) ));
        });
        return [false, asistentes];
    }

    async Obtener(id)
    {
        const query = 'SELECT id, usuario, curso FROM asistentes WHERE id = ?';
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [id]);
        }
        catch(e)
        {
            // console.log(e);
            return ['db', {}];
        }
        finally
        {
            conn.end();
        }
        return [false, rows[0] ? new Asistente(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if(!this.usuario || !this.curso) return ['usr', {
            usuario: this.usuario ? 'ok' : 'requerido',
            curso  : this.curso   ? 'ok' : 'requerido'
        }];

        let query = 'INSERT INTO asistentes SET usuario = ?, curso = ?';
        let datos = [this.usuario, this.curso];
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, datos);
        }
        catch(e)
        {
            // console.log(e);
            return ['db', {}];
        }
        finally
        {
            conn.end();
        }
        return [false, this];
    }

    async Actualizar(id)
    {
        let query  = 'UPDATE asistentes SET ';
            query += this.usuario ? 'usuario = ?,' : '';
            query += this.curso   ? 'curso   = ?,' : '';
            query  = query.substr(0, query.length - 1) ;
            query += ' WHERE id = ?';

        let datos = [this.usuario, this.curso].filter(Boolean);
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, datos);
        }
        catch(e)
        {
            // console.log(e);
            return ['db', {}];
        }
        finally
        {
            conn.end();
        }
        return [false, this];
    }

    async Eliminar(id)
    {
        const query = 'DELETE FROM asistentes WHERE id = ?';
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, [id]);
        }
        catch(e)
        {
            // console.log(e);
            return ['db', {}];
        }
        finally
        {
            conn.end();
        }
        return [false, {}];
    }
}
module.exports = Asistente;