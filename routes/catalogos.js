const express = require('express');
const router  = express.Router({mergeParams: true});
const db      = require('../db');

//  Obtener instituciones registradas
/**
 * @url GET /catalogos/instituciones
 */
router.get('/instituciones', async(req, res) => {
    let query  = 'SELECT DISTINCT institucion FROM salones ';
        query += 'ORDER BY institucion ASC'; 
    let conn, rows;
    try
    {
        conn = await db.Iniciar();
        rows = await conn.query(query);
    }
    catch(e)
    {
        res.statusCode = 500;
        console.log(e);
    }
    finally
    {
        if(conn) conn.end();
    }

    let instituciones = rows.map( el => {
        return el.institucion;
    })

    return res.json(instituciones);
});

//  Obtener Facultades por institucion
/**
 *  @url GET /catalogos/instituciones/:institucion/facultades
 * 
 *  NOTA: * institucion 
 *        [generada en @GET /catalogos/instituciones] 
 */
router.get('/instituciones/:institucion/facultades', async(req, res) => {
    const institucion = req.params.institucion;
    let query  = 'SELECT DISTINCT facultad FROM salones ';
        query += 'WHERE institucion = ? ORDER BY facultad ASC';
    let conn, rows;
    try
    {
        conn = await db.Iniciar();
        rows = await conn.query(query, institucion);
    }
    catch(e)
    {
        res.statusCode = 500;
    }
    finally
    {
        if(conn) conn.end();
    }
    let facultades = rows.map(el => {
        return el.facultad;
    });
    return res.json(facultades);
});

module.exports = router;