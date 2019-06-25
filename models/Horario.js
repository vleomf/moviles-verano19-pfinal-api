const db = require('../db');
const cc = require('camelcase-keys');

class Horario
{
    constructor(h)
    {
        if(!h) return;
        this.id    = h.id;
        this.curso = h.curso;
        this.salon = h.salon;
        this.dia   = h.dia;
        this.hora  = h.hora;
    }

    async ObtenerTodos()
    {
        let query  = 'SELECT id, curso, salon, dia, hora FROM horarios';
        let rows, conn;
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
        let horarios = [];
        rows.forEach(element => {
            horarios.push( new Horario(cc(element)));
        });
        return [false, horarios];
    }

    async Obtener(id)
    {
        let query  = 'SELECT id, curso, salon, dia, hora FROM horarios WHERE id = ?';
        let rows, conn;
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
        return [false, rows[0] ? new Horario(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if(!this.curso || !this.dia || !this.hora) return ['usr', {
            curso: this.curso ? 'ok' : 'requerido',
            salon: this.salon ? 'ok' : 'requerido',
            dia:   this.dia   ? 'ok' : 'requerido',
            hora:  this.hora  ? 'ok' : 'requerido'
        }];

        let query = 'INSERT INTO horarios SET curso = ?, salon = ?, dia = ?, hora = ?';
        let datos = [this.curso, this.salon, this.dia, this.hora];

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
        let query  = 'UPDATE horarios SET ';
            query += this.curso ? 'curso = ?,' : '';
            query += this.salon ? 'salon = ?'  : '';
            query += this.dia   ? 'dia   = ?,' : '';
            query += this.hora  ? 'hora  = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?';
        
        let datos = [this.curso, this.dia, this.hora, id].filter(Boolean);

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
        const query = 'DELETE from horarios WHERE id = ?';
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

module.exports = Horario;