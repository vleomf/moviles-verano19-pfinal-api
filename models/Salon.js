const db = require('../db');
const cc = require('camelcase-keys');

class Salon
{
    constructor(s)
    {
        if(!s) return;
        this.id          = s.id;
        this.codigo      = s.codigo;
        this.edificio    = s.edificio;
        this.facultad    = s.facultad;
        this.institucion = s.institucion;
        this.latitud     = s.latitud;
        this.longitud    = s.longitud;
    }

    async ObtenerTodos()
    {
        let query  = 'SELECT id, codigo, edificio,';
            query += 'facultad, institucion, latitud, longitud';
            query += 'FROM salones';
        
            let conn
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

        let salones = [];
        rows.forEach( row => {
            salones.push( new Salon( cc(row) ));
        });

        return [false, salones];
    }

    async Obtener(id)
    {
        let query  = 'SELECT id, codigo, edificio,';
            query += 'facultad, institucion, latitud, longitud';
            query += 'FROM salones WHERE id = ?';

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

        return [false, rows[0] ? new Salon(cc(rows[0])) : {}];
    }

    async Crear()
    {
        if( !this.curso || !this.codigo || !this.edificio || !this.facultad ||
            !this.institucion) return ['U-1000', {
                codigo: this.codigo           ? 'ok' : 'requerido',
                edificio: this.edificio       ? 'ok' : 'requerido',
                facultad: this.facultad       ? 'ok' : 'requerido',
                institucion: this.institucion ? 'ok' : 'requerido',
                latitud:  'opcional',
                longitud: 'opcional'
            }];
        
        let query  = 'INSERT INTO salones SET codigo = ?, edificio = ?, ';
            query += 'facultad = ?, institucion = ?,';
            query += this.latitud  ? 'latitud  = ?,' : '';
            query += this.longitud ? 'longitud = ?,' : '';
            query  = query.substring(0, query.length - 1);
            
        let datos = [ this.codigo, this.edificio, this.facultad,
        this.institucion, this.latitud, this.longitud].filter(Boolean);

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
        let query  = 'UPDATE salones SET ';
            query += this.codigo ? 'codigo = ?,' : '';
            query += this.edificio ? 'edificio = ?,' : '';
            query += this.facultad ? 'facultad = ?,' : '';
            query += this.institucion ? 'institucion = ?,' : '';
            query += this.latitud ? 'latitud = ?,' : '';
            query += this.longitud ? 'longitud = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?'; 
        
        let datos = [ this.codigo, this.edificio, this.facultad,
            this.institucion, this.latitud, this.longitud].filter(Boolean);
        
        if(!datos.length) return ['U-1000', {
            enviados: 0,
            disponibles: Object.keys(this).filter( el => { return el != 'id' ? el : undefined })
        }]

        datos.push(id);
        
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
        const query = 'DELETE FROM salones WHERE id = ?';
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


module.exports = Salon;