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

    static async ObtenerTodosHoy()
    {
        const diaN = new Date().getDay();
        const diaS = diaN == 0 ? 'D' : diaN == 1 ? 'L' : diaN == 2 ? 'A' : diaN == 3 ? 'M' : diaN == 4 ? 'J' : diaN == 5 ? 'V' : diaN == 6 ? 'S' : ''; 
        let query  = 'SELECT c.id, c.matricula, c.nombre, c.inicio, c.fin, h.hora, s.edificio, s.codigo, s.facultad, s.institucion FROM cursos AS c INNER JOIN ';
            query += 'horarios as h ON h.curso = c.id INNER JOIN salones as s ON s.id = h.salon WHERE h.dia = ? ORDER BY h.hora'; 
        
        let conn;
        let rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, diaS);
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
            let curso         = new Curso();
            curso.id          = row['id'];
            curso.matricula   = row['matricula'];
            curso.nombre      = row['nombre'];
            curso.inicio      = row['inicio'];
            curso.fin         = row['fin'];
            curso.hora        = row['hora'];
	    curso.salon       = row['codigo'];
            curso.edificio    = row['edificio'];
            curso.facultad    = row['facultad'];
            curso.institucion = row['institucion'];
            cursos.push( curso );
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
            console.log('curso', e);
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

        return[false, null];
    }
}

module.exports = Curso;
