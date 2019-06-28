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

    static async ObtenerTodos()
    {
        let query  = 'SELECT id, codigo, edificio,';
            query += 'facultad, institucion, latitud, longitud';
            query += 'FROM salones ORDER BY institucion, facultad';
        
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

        let salones = [];
        rows.forEach( row => {
            salones.push( new Salon( cc(row) ));
        });

        return [false, salones];
    }

    static async Obtener(id)
    {
        let query  = 'SELECT id, codigo, edificio,';
            query += 'facultad, institucion, latitud, longitud';
            query += ' FROM salones WHERE id = ? ORDER BY institucion, facultad';

        let conn;
        let rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [id]);
            if(!rows.length) return[false, null];
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
                default             : return [{
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

        return [false, new Salon(cc(rows[0]))];
    }

    async Crear()
    {
        if( !this.codigo || !this.edificio || !this.facultad ||
            !this.institucion) return [{
                codigo: 'U-1000',
                tipo: 'U',
                ofensa: {
                    requeridos: {
                        codigo:      this.codigo      ? true : false,
                        edificio:    this.edificio    ? true : false,
                        facultad:    this.facultad    ? true : false,
                        institucion: this.institucion ? true : false,
                    },
                    opcionales: ['latitud', 'longitud']
                }
            }, null];
        
        let query  = 'INSERT INTO salones SET codigo = ?, edificio = ?, ';
            query += 'facultad = ?, institucion = ?,';
            query += this.latitud  ? 'latitud  = ?,' : '';
            query += this.longitud ? 'longitud = ?,' : '';
            query  = query.substring(0, query.length - 1);
            
        let datos = [ this.codigo, this.edificio, this.facultad,
        this.institucion, this.latitud, this.longitud].filter(Boolean);

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, datos);
            this.id = rows.insertId;
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
                default             : return [{
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
        let query  = 'UPDATE salones SET ';
            query += this.codigo ? 'codigo = ?,' : '';
            query += this.edificio ? 'edificio = ?,' : '';
            query += this.facultad ? 'facultad = ?,' : '';
            query += this.institucion ? 'institucion = ?,' : '';
            query += this.latitud ? 'latitud = ?,' : '';
            query += this.longitud ? 'longitud = ?,' : '';
            query  = query.substring(0, query.length - 1);
            query += ' WHERE id = ?'; 
        
        let query2  = 'SELECT id, codigo, edificio, facultad, institucion, latitud, longitud';
            query2 += ' FROM salones WHERE id = ?';
        
        let datos = [ this.codigo, this.edificio, this.facultad,
            this.institucion, this.latitud, this.longitud].filter(Boolean);
        
        if(!datos.length) return [{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa:  {
                enviados: 0,
                disponibles: Object.keys(this).filter( el => { return el != 'id' ? el : undefined })
            }
        }, null]

        datos.push(this.id);
        
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, datos);

            const datosActualizados = await conn.query(query2, this.id);
            this.codigo      = datosActualizados[0]['codigo'];
            this.edificio    = datosActualizados[0]['edificio'];
            this.facultad    = datosActualizados[0]['facultad'];
            this.institucion = datosActualizados[0]['institucion'];
            this.latitud     = datosActualizados[0]['latitud'];
            this.longitud    = datosActualizados[0]['longitud'];
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

        return [false, null];
    }

    async Eliminar()
    {
        const query = 'DELETE FROM salones WHERE id = ?';
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, [this.id]);
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
        return [false, null];
    }
}


module.exports = Salon;