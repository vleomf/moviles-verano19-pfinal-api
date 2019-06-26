const db = require('../db');
const cc = require('camelcase-keys');

class Curso
{
    constructor(c)
    {
        if(!c) return;
        this.id = c.id;
        this.matricula = c.matricula;
        this.nombre = c.nombre;
        this.inicio = c.inicio;
        this.fin = c.fin;
    }

    async ObtenerTodos()
    {
        const query  = 'SELECT id, matricula, nombre, inicio, fin FROM cursos';

        let conn;
        let rows;
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

        let cursos = [];
        rows.forEach( row => {
            cursos.push( new Curso( cc(row) ) );
        });

        return [false, cursos];
    }

    async Obtener(id)
    {
        let query  = "SELECT id, matricula, nombre, inicio, fin FROM cursos";
            query += " WHERE id = ?";
        
        let conn;
        let rows;
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
        return [false, rows[0] ? new Curso(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if(!this.matricula || !this.nombre || !this.inicio || !this.fin) return ['U-1000',{
            matricula: this.matricula ? 'ok' : 'requerido',
            nombre:    this.nombre    ? 'ok' : 'requerido',
            inicio:    this.inicio    ? 'ok' : 'requerido',
            fin:       this.fin       ? 'ok' : 'requerido'
        }];

        let query = 'INSERT INTO cursos SET matricula = ?, nombre = ?, inicio = ?, fin = ?';
        let datos = [ this.matricula, this.nombre, this.inicio, this.fin ];

        let conn;
        try
        {
            conn = await db.Iniciar()
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
        let query  = 'UPDATE cursos SET ';
            query += this.matricula ? 'matricula = ?,' : '';
            query += this.nombre    ? 'nombre    = ?,' : '';
            query += this.inicio    ? 'inicio    = ?,' : '';
            query += this.fin       ? 'fin       = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?';
        
        let datos = [ this.matricula, this.nombre, this.inicio, this.fin].filter(Boolean);
        if(!datos.length) return ['U-1000', {
            enviados: 0,
            disponibles: Object.keys(this).filter(el => { return el != 'id' ? el : undefined })
        }];
        datos.push(id);
        
        let conn;
        try
        {
            conn =  await db.Iniciar();
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
        const query = 'DELETE FROM cursos WHERE id = ?';

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

        return[false, {}];
    }
}

module.exports = Curso;