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

    static async ObtenerPorCurso(idCurso)
    {
        let query  = 'SELECT asis.id, asis.fecha, cur.matricula, cur.nombre, usr.matricula, usr.nombre, usr.ap_paterno, ';
            query += 'usr.ap_materno FROM asistencia as asis INNER JOIN asistentes as asts on asts.id = asis.asistente ';
            query += 'INNER JOIN usuarios as usr on asts.usuario = usr.id INNER JOIN cursos as cur on cur.id = asts.curso ';
            query += 'WHERE cur.id = ? ORDER BY asis.fecha, usr.ap_paterno, usr.ap_materno, usr.nombre'; 
        let conn, rows;
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
       
        return [false, rows];
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

    static async EliminarAsistentePorCurso(idAsistencia, idCurso)
    {
        let query  = 'SELECT count(asis.id) as total FROM asistencia as asis INNER JOIN asistentes as asts ';
            query += 'ON asis.asistente = asts.id WHERE asis.id = ? AND asts.curso = ?';
        
        let query2 = 'DELETE FROM asistencia WHERE id = ?';
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [idAsistencia, idCurso]);
            if(!rows[0]['total']) return [{
                codigo: 'U-1000',
                tipo: 'U',
                ofensa: 'Asistencia no existe'
            }, null];
            await conn.query(query2, idAsistencia);
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