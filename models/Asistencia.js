const db = require('../db');
const cc = require('camelcase-keys');
const Usuario = require('./Usuario');

class Asistencia
{
    constructor(a)
    {
        if(!a) return;
        this.asistente = a.asistente;
        this.fecha = a.fecha;
    }

    static async ObtenerPorAsistente(idAsistente)
    {
        let query = 'SELECT id, fecha, assistente FROM asistencia WHERE asistente = ?';
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query. idAsistente);
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
        let asistencias = [];
        rows.forEach( asistencia => {
            asistencias.push( new Asistencia(cc(asistencia)));
        });

        return [false, asistencias];
    }

    async Crear()
    {
        let query = 'INSERT INTO asistencia SET asistente = ?, fecha = ?';
        let datos = [this.asistente, this.fecha];

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
}

module.exports = Asistencia;