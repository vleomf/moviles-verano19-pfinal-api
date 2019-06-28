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

    static async ObtenerTodos()
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
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo: 'N',
                    ofensa: false
                }, null];
                default : return [{
                    codigo: 'E-1000',
                    tipo: 'N',
                    ofensa: false
                }, null];
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

    static async Obtener(id)
    {
        let query  = "SELECT id, matricula, nombre, inicio, fin FROM cursos";
            query += " WHERE id = ?";
        
        let conn;
        let rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, id);    
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
        return [false, new Curso(cc(rows[0]))];
    }

    async Crear()
    {
        if(!this.matricula || !this.nombre || !this.inicio || !this.fin) return [{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa: {
                requeridos: {
                    matricula: this.matricula ? true : false,
                    nombre:    this.nombre    ? true : false,
                    inicio:    this.inicio    ? true : false,
                    fin:       this.fin       ? true : false
                }
            }
        }, null];

        let query = 'INSERT INTO cursos SET matricula = ?, nombre = ?, inicio = ?, fin = ?';
        let datos = [ this.matricula, this.nombre, this.inicio, this.fin ];

        let conn, rows;
        try
        {
            conn = await db.Iniciar()
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

        return [false, this];
    }   

    async Actualizar()
    {
        let query  = 'UPDATE cursos SET ';
            query += this.matricula ? 'matricula = ?,' : '';
            query += this.nombre    ? 'nombre    = ?,' : '';
            query += this.inicio    ? 'inicio    = ?,' : '';
            query += this.fin       ? 'fin       = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?';

        let quer2  = 'SELECT id, matricula, nombre, inicio, fin FROM cursos WHERE id = ?';
        
        let datos = [ this.matricula, this.nombre, this.inicio, this.fin].filter(Boolean);
        
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
            conn =  await db.Iniciar();
            await conn.query(query, datos);

            const datosActualizados = await conn.query(quer2, this.id);
            this.matricula = datosActualizados[0]['matricula'];
            this.nombre    = datosActualizados[0]['nombre'];
            this.inicio    = datosActualizados[0]['inicio'];
            this.fin       = datosActualizados[0]['fin'];
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
        const query = 'DELETE FROM cursos WHERE id = ?';

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

        return[false, null];
    }
}

module.exports = Curso;