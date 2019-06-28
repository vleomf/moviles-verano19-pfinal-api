const db = require('../db');
const cc = require('camelcase-keys');

class Actividad
{
    constructor(a)
    {
        if(!a) return;
        this.id     = a.id;
        this.curso  = a.curso;
        this.nombre = a.nombre; 
        this.indice = a.indice;
        this.descripcion = a.descripcion;
    }

    static async ObtenerTodosPorCurso(idCurso)
    {
        let query = 'SELECT id, curso, nombre, indice, descripcion FROM actividades WHERE curso = ? ORDER BY indice';
        let rows, conn;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, idCurso);
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
        let actividades = [];
        rows.forEach(actividad => {
            actividades.push( new Actividad(cc(actividad)));
        });
        return [false, actividades];
    }

    static async ObtenerPor_id_cursoId(idCurso, idActividad)
    {
        let query  = 'SELECT id, curso, nombre, indice, descripcion FROM actividades ';
            query += 'WHERE curso = ? AND id = ? ORDER BY indice'
        let rows, conn;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [idCurso, idActividad]);
            if(!rows.length) return [false, null];
        }
        catch(e)
        {
            console.log(e)
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
        return [false, new Actividad(cc(rows[0]))];
    }

    async Crear()
    {
        let query = 'INSERT INTO actividades SET curso = ?, nombre = ?, indice = ?, descripcion = ?';
        let datos = [this.curso, this.nombre, this.indice, this.descripcion];

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
        let query  = 'UPDATE actividades SET ';
            query += this.nombre ? 'nombre = ?,' : '';
            query += this.indice ? 'indice = ?,' : '';
            query += this.descripcion ? 'descripcion = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?';
        let query2 = 'SELECT id, curso, nombre, indice, descripcion FROM actividades WHERE id = ?';
        let datos  = [this.nombre, this.indice, this.descripcion].filter(Boolean);

        if(!datos.length) return[{
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
            this.curso       = datosActualizados[0]['curso'];
            this.indice      = datosActualizados[0]['indice'];
            this.nombre      = datosActualizados[0]['nombre'];
            this.descripcion = datosActualizados[0]['descripcion'];
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
}

module.exports = Actividad;