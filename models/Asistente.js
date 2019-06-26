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

    async ObtenerTodos(idCurso)
    {
        const query = 'SELECT id, usuario, curso FROM asistentes WHERE curso = ?';
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [idCurso]);
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return ['N-1000', {}];
                default             : return ['E-1000', {}];
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        let asistentes = [];
        rows.forEach( row => {
            asistentes.push( new Asistente( cc(row) ));
        });
        return [false, asistentes];
    }

    async Obtener(idAsistente, idCurso)
    {
        let query  = 'SELECT id, usuario, curso FROM asistentes WHERE id = ?';
            query += 'AND curso = ?';
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [idAsistente, idCurso]);
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return ['N-1000', {}];
                default             : return ['E-1000', {}];
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        return [false, rows[0] ? new Asistente(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if(!this.usuario || !this.curso) return ['U-1000', {
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
            switch(e.code)
            {
                case 'ECONNREFUSED' : return ['N-1000', {}];
                default             : return ['E-1000', {}];
            }
        }
        finally
        {
            if(conn) conn.end();
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
        if(!datos.length) return ['U-1000', {
            enviados: 0,
            disponibles: Object.keys(this).filter( el => { return el != 'id' ? el : undefined })
        }];
        datos.push(id);
        
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, datos);
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return ['N-1000', {}];
                default             : return ['E-1000', {}];
            }
        }
        finally
        {
            if(conn) conn.end();
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
            switch(e.code)
            {
                case 'ECONNREFUSED' : return ['N-1000', {}];
                default             : return ['E-1000', {}];
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        return [false, {}];
    }
}
module.exports = Asistente;