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

    static async ObtenerTodos()
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
        let horarios = [];
        rows.forEach(element => {
            horarios.push( new Horario(cc(element)));
        });
        return [false, horarios];
    }

    static async Obtener(id)
    {
        let query  = 'SELECT id, curso, salon, dia, hora FROM horarios WHERE id = ?';
        let rows, conn;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [id]);
            if(!rows.length) return [false, null];
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
        return [false, new Horario(cc(rows[0]))];
    }

    static async ObtenerPorCurso(idCurso)
    {
        let query  = 'SELECT id, curso, salon, dia, hora FROM horarios WHERE curso = ?';
        let rows, conn;
        try
        {   
            conn = await db.Iniciar();
            rows = await conn.query(query, [idCurso]);
            if(!rows.length) return [false, null];
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
        let horarios = [];
        rows.forEach(element => {
            horarios.push( new Horario(cc(element)));
        });
        return [false, horarios];
    }

    async Crear()
    {
        if(!this.curso || !this.dia || !this.hora) return [{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa: {
                requeridos: {
                    curso: this.curso ? true : false,
                    salon: this.salon ? true : false,
                    dia:   this.dia   ? true : false,
                    hora:  this.hora  ? true : false
                }
            }
        }, null];

        let query = 'INSERT INTO horarios SET curso = ?, salon = ?, dia = ?, hora = ?';
        let datos = [this.curso, this.salon, this.dia, this.hora];

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, datos);
            this.id = rows.insertId;
        }
        catch(e)
        {
            console.log('horario', e);
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
        return [false, null];
    }

    async Actualizar()
    {
        let query  = 'UPDATE horarios SET ';
            query += this.curso ? 'curso = ?,' : '';
            query += this.salon ? 'salon = ?'  : '';
            query += this.dia   ? 'dia   = ?,' : '';
            query += this.hora  ? 'hora  = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?';

        let query2 = 'SELECT id, curso, salon, dia, hora FROM horarios WHERE id = ?';
        
        let datos = [this.curso, this.salon, this.dia, this.hora].filter(Boolean);

        if(!datos.length) return [{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa: {
                enviados: 0,
                disponibles: Object.keys(this).filter( e => { return e != 'id' ? e : undefined })
            }
        }, null];

        datos.push(this.id);

        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, datos);
            
            const datosActualizados = await conn.query(query2, this.id);
            this.curso = datosActualizados[0]['curso'];
            this.salon = datosActualizados[0]['salon'];
            this.dia   = datosActualizados[0]['dia'];
            this.hora  = datosActualizados[0]['hora'];
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
        return [false, null];
    }

    async Eliminar()
    {
        const query = 'DELETE from horarios WHERE id = ?';
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, this.id);
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
                default  : return [{
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
        return [false, null];
    }

    static async EliminarDeCurso(idCurso)
    {
        const query = 'DELETE from horarios WHERE curso = ?';
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, idCurso);
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
                default  : return [{
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
        return [false, null];
    }
}

module.exports = Horario;