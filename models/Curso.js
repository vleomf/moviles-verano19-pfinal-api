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
            //console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al obtener los Cursos'
            }];
        }
        finally
        {
            conn.end();
        }

        let cursos = [];
        rows.forEach( row => {
            cursos.push( new Curso( cc(row) ) );
        });

        return [{error: false}, cursos];
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
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al obtener Curso'                
            }];
        }
        finally
        {
            conn.end();
        }
        return [{error: false}, rows[0] ? new Curso(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if(!this.matricula || !this.nombre || !this.inicio || !this.fin) return [{error: 'usr'},{
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
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al crear Curso'
            }];
        }
        finally
        {
            conn.end();
        }

        return [{error: false}, this];
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
        
        let datos = [ this.matricula, this.nombre, this.inicio, this.fin, id ].filter(Boolean);
        
        let conn;
        try
        {
            conn =  await db.Iniciar();
            await conn.query(query, datos);
        }
        catch(e)
        {
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al actualizar Curso'
            }];
        }
        finally
        {
            conn.end();
        }

        return [{error: false}, this];
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
            // console.log(e)
            return [{error: 'db'}, {
                mensaje: 'Error al eliminar Curso'
            }];
        }
        finally
        {
            conn.end();
        }

        return[{error: false}, {}];
    }
}

module.exports = Curso;