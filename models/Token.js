const db = require('../db');
const randomstring = require('randomstring');
const moment     = require('moment');

class Token
{
    static async Generar(idUsr)
    {
        let query  = 'INSERT INTO tokens SET ';
            query += 'id = ?, fecha_creacion = ?,';
            query += 'expiracion = ?, token = ?';

        let hora_actual   = moment();
        let hora_creacion = hora_actual.format();
        let expiracion    = hora_actual.add(30, 'minutes').format();
        let token = randomstring.generate({ length: 50 });

        let datos = [ idUsr, hora_creacion, expiracion, token];
        
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, datos);
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo  : 'N',
                    ofensa: false
                }, null];
                default             : return [{
                    codigo: 'E-1000',
                    tipo  : 'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }

        return [false, token];
    }

    static async Verificar(token)
    {
        let query = 'SELECT id, fecha_creacion, expiracion, token FROM tokens WHERE token = ?';

        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, token);
            if(!rows.length) return [false, null];
        }
        catch(e)
        {
            switch(e.code)
            {
                case 'ECONNREFUSED' : return [{
                    codigo: 'N-1000',
                    tipo  : 'N',
                    ofensa: false
                }, null];
                default             : return [{
                    codigo: 'E-1000',
                    tipo  : 'E',
                    ofensa: false
                }, null];
            }
        }
        finally
        {
            if(conn) conn.end();
        }
        
        return [false, rows[0]];
    }
}

module.exports = Token; 