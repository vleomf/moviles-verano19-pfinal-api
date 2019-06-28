const db = require('../db');
const randomstring = require('randomstring');
const moment     = require('moment');

class Token
{
    static async Generar(idUsr)
    {
        [err] = await Token.Eliminar(idUsr);
        if(err)
        {
            return [err, null];
        }

        let query  = 'INSERT INTO tokens SET ';
            query += 'id = ?, fecha_creacion = ?,';
            query += 'expiracion = ?, token = ?';

        let hora_actual   = moment();
        let hora_creacion = hora_actual.format();
        let expiracion    = hora_actual.add(300, 'minutes').format();
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
            console.log(e);
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
        if(!token) return[{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa: {
                token: false
            }
        }, null];

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
            console.log(e);
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

    static async Eliminar(idUsr)
    {
        let query  = 'DELETE FROM tokens WHERE id = ?';
        let conn;
        try
        {
            conn = await db.Iniciar();
            await conn.query(query, idUsr);
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
        return[false, null];
    }
}

module.exports = Token; 