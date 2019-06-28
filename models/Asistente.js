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

    static async ObtenerTodos(idCurso)
    {
        const query = 'SELECT id, usuario, curso FROM asistentes WHERE curso = ?';
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, idCurso);
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
        let asistentes = [];
        rows.forEach( row => {
            asistentes.push( new Asistente( cc(row) ));
        });
        return [false, asistentes];
    }

    static async Obtener(idAsistente, idCurso)
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
        return [false, new Asistente(cc(rows[0]))];
    }

    async Crear()
    {
        if(!this.usuario || !this.curso) return [{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa: {
                requeridos: {
                    usuario: this.usuario ? true : false,
                    curso:   this.curso   ? true : false
                }
            }
        }, null];

        let query = 'INSERT INTO asistentes SET usuario = ?, curso = ?';
        let datos = [this.usuario, this.curso];
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, datos);
            this.id = rows.insertId;
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

    async Actualizar()
    {
        let query  = 'UPDATE asistentes SET ';
            query += this.usuario ? 'usuario = ?,' : '';
            query += this.curso   ? 'curso   = ?,' : '';
            query  = query.substr(0, query.length - 1) ;
            query += ' WHERE id = ?';

        let query2 = 'SELECT id, usuario, curso FROM asistentes WHERE id = ?';

        let datos = [this.usuario, this.curso].filter(Boolean);

        if(!datos.length) return [{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa: {
                enviados: 0,
                disponibles: Object.keys(this).filter( el => { return el != 'id' ? el : undefined })
            }
        }, null];

        datos.push(this.id);
        
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, datos);

            const datosActualizados = await conn.query(query2, this.id);
            this.usuario = datosActualizados[0]['usuario'];
            this.curso   = datosActualizados[0]['curso'];
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
        const query = 'DELETE FROM asistentes WHERE id = ?';
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
                }, {}];
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
}
module.exports = Asistente;