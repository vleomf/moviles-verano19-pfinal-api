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
        return [false, rows[0] ? new Horario(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if(!this.curso || !this.dia || !this.hora) return ['U-1000', {
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
        let query  = 'UPDATE horarios SET ';
            query += this.curso ? 'curso = ?,' : '';
            query += this.salon ? 'salon = ?'  : '';
            query += this.dia   ? 'dia   = ?,' : '';
            query += this.hora  ? 'hora  = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?';
        
        let datos = [this.curso, this.dia, this.hora].filter(Boolean);
        if(!datos.length) return ['U-1000', {
            enviados: 0,
            disponibles: Object.keys(this).filter( e => { return e != 'id' ? e : undefined })
        }];

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
        const query = 'DELETE from horarios WHERE id = ?';
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

module.exports = Horario;