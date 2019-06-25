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

        let rows;
        try
        {
            const conn = await db.Iniciar();
            rows = await conn.query(query);
        }
        catch(e)
        {
            //console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al obtener los Cursos'
            }];
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
        
        let rows;
        try
        {
            const conn = await db.Iniciar();
            rows = await conn.query(query, [id]);           
        }
        catch(e)
        {
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al obtener Curso'                
            }];
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

        try
        {
            const conn = await db.Iniciar()
            await conn.query(query, datos);
        }
        catch(e)
        {
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al crear Curso'
            }];
        }

        return [{error: false}, this];
    }   

    async Actualizar(id)
    {
        let query = 'UPDATE cursos SET matricula = ?, nombre = ?, inicio = ?, fin = ? WHERE id = ?';
        let datos = [ this.matricula, this.nombre, this.inicio, this.fin, id ];
        
        try
        {
            const conn =  await db.Iniciar();
            await conn.query(query, datos);
        }
        catch(e)
        {
            // console.log(e);
            return [{error: 'db'}, {
                mensaje: 'Error al actualizar Curso'
            }];
        }

        return [{error: false}, this];
    }

    async Eliminar(id)
    {
        const query = 'DELETE FROM cursos WHERE id = ?';

        try
        {
            const conn = await db.Iniciar();
            await conn.query(query, [id]);
        }
        catch(e)
        {
            // console.log(e)
            return [{error: 'db'}, {
                mensaje: 'Error al eliminar Curso'
            }];
        }

        return[{error: false}, {}];
    }
}

module.exports = Curso;