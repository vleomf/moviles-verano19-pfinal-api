const db = require('../db');
const cc = require('camelcase-keys');
const Usuario = require('./Usuario');

class Asistente
{
    constructor(a)
    {
        if(!a) return;
        this.id = a.id;
        this.usuario = a.usuario;
        this.curso = a.curso;
    }

    static async ObtenerPorCurso(idCurso)
    {
        //WHERE curso = ?
        let query  = 'SELECT a.id, u.matricula, u.ap_paterno, u.ap_materno, u.nombre FROM asistentes AS a ';
            query += 'INNER JOIN usuarios AS u ON a.usuario = u.id WHERE a.curso = ? AND u.rol != \'profesor\' ORDER BY u.rol'
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, idCurso);
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
        let asistentes = [];
        rows.forEach( row => {
            asistentes.push( new Usuario( cc(row) ));
        });
        return [false, asistentes];
    }

    static async ObtenerUsuarioPorCurso(idCurso, idUsuario)
    {
        //WHERE curso = ?
        let query  = 'SELECT a.id, u.ap_paterno, u.ap_materno, u.nombre, u.rol FROM asistentes AS a ';
            query += 'INNER JOIN usuarios AS u ON a.usuario = u.id WHERE a.curso = ? AND u.id = ? ORDER BY u.rol'
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [idCurso, idUsuario]);
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
        return [false, new Usuario(cc(rows[0]))];
    }

    static async ObtenerAsistentePorCurso(idCurso, idUsuario)
    {
        //WHERE curso = ?
        let query  = 'SELECT a.id, u.ap_paterno, u.ap_materno, u.nombre, u.rol FROM asistentes AS a ';
            query += 'INNER JOIN usuarios AS u ON a.usuario = u.id WHERE a.curso = ? AND a.id = ? ';
            query += ' AND u.rol != \'profesor\' ORDER BY u.rol'
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, [idCurso, idUsuario]);
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
        return [false, new Usuario(cc(rows[0]))];
    }

    async Crear()
    {
        if(!this.usuario || !this.curso) return [{
            codigo: 'U-1000',
            tipo: 'U',
            ofensa: {
                requeridos: {
                    usuario: this.usuario ? true : false,
                    curso:   this.curso   ? true : false
                }
            }
        }, null];

        let query = 'INSERT INTO asistentes SET usuario = ?, curso = ?';
        let datos = [this.usuario, this.curso];
        let conn, rows;
        try
        {
            conn = await db.Iniciar();
            rows = await conn.query(query, datos);
            this.id = rows.insertId;
        }
        catch(e)
        {
            console.log('asistente', e);
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

    async Actualizar()
    {
        let query  = 'UPDATE asistentes SET ';
            query += this.usuario ? 'usuario = ?,' : '';
            query += this.curso   ? 'curso   = ?,' : '';
            query  = query.substr(0, query.length - 1) ;
            query += ' WHERE id = ?';

        let query2 = 'SELECT id, usuario, curso FROM asistentes WHERE id = ?';

        let datos = [this.usuario, this.curso].filter(Boolean);

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
            conn = await db.Iniciar();
            await conn.query(query, datos);

            const datosActualizados = await conn.query(query2, this.id);
            this.usuario = datosActualizados[0]['usuario'];
            this.curso   = datosActualizados[0]['curso'];
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
        const query = 'DELETE FROM asistentes WHERE id = ?';
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
                }, {}];
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
module.exports = Asistente;