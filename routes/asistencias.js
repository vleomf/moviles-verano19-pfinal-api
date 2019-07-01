const express = require('express');
const router  = express.Router({mergeParams: true});
const Acceso     = require('../middlewares/Acceso');
const Curso      = require('../models/Curso');
const Salon      = require('../models/Salon');
const Horario    = require('../models/Horario');
const Asistente  = require('../models/Asistente');
const Asistencia = require('../models/Asistencia');
const Actividad  = require('../models/Actividad');
const Usuario    = require('../models/Usuario');
const Jschema    = require('jsonschema').Validator;
const moment     = require('moment');

//  Obtener asistencias del Curso
//  NOTA: Solo un profesor tiene permiso de aceder a esta url
/**
 * @url GET /cursos/:id/asistencias
 */
router.get('/', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    
    // [error, listaAsistencia] = await Asistencia.ObtenerPorCurso(idCurso);
    // if(error)
    // {
    //     res.statusCode = 500;
    //     return res.json({
    //         error: {
    //             codigo: error.codigo,
    //             objetivo: `${req.method} ${req.url}`,
    //             cuerpo: req.body,
    //             ofensa: error.ofensa
    //         }
    //     })
    // }

    // return res.json(listaAsistencia);

    [error, asistentes] = await Asistente.ObtenerPorCurso(idCurso);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error.codigo,
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }    
    let listaAsistencia = [];
    const fechaActual   = moment().format('YYYY-MM-DD');
    for(let i = 0; i < asistentes.length; i++)
    {
        [_, asistencia] = await Asistencia.ObtenerPorCursoAsistenteFecha(idCurso, asistentes[i].id, fechaActual);
        if(asistencia)
        {
            asistentes[i].asistencia = {
                id: asistencia[0].id,
                fecha: asistencia[0].fecha
            }
        }
        else
        {
            asistentes[i].asistencia = false;
        }
    }
    return res.json(asistentes);
});

//  Eliminar asistencia del Curso por ID
//  NOTA: Solo un profesor tiene permiso de aceder a esta url
/**
 * @url DELETE /cursos/:idCurso/asistencias/:idAsistencia
 */
router.delete('/:idAsistencia', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    const idAsistencia = req.params.idAsistencia;
    [error, _] = await Asistencia.EliminarAsistentePorCurso(idAsistencia, idCurso);
    if(error)
    {
        switch(error.tipo)
        {
            case 'U':
                res.statusCode = 404; break;
            default:
                res.statusCode = 500; break;
        }
        return res.json({
            error: {
                codigo: error.codigo,
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }
    return res.json();
});

//  Registrar asistencia a un Estudiante por Curso
//  NOTA: Solo un profesor tiene permiso de acceder a esta url
/**
 * @url POST /cursos/:id/asistencias
 * @body 
 * {
 *      asistente: < asistentes.id >
 *      fecha:     <   datetime    >
 * }
 */
router.post('/', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    const datosAsistencia = req.body;

    if(!datosAsistencia)
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: {
                    schema: {
                        'asistente' : 'int, requerido',
                        'fecha'     : 'datetime, requerido'
                    }
                }
            }
        })
    }
    else
    {
        if(!datosAsistencia.asistente || !datosAsistencia.fecha)
        {
            res.statusCode = 400;
            return res.json({
                error: {
                    codigo: 'U-1000',
                    objetivo: `${req.method} ${req.url}`,
                    cuerpo: req.body,
                    ofensa: {
                        schema: {
                            'asistente' : 'int, requerido',
                            'fecha'     : 'datetime, requerido'
                        }
                    }
                }
            })
        }
    }

    [error, asistente] = await Asistente.ObtenerAsistentePorCurso(idCurso, datosAsistencia.asistente);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error.codigo,
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }
    if(!asistente)
    {
        res.statusCode = 404;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: 'Asistete no existe en registro de clase'
            }
        });
    }

    let asistencia;
    const fechaActual   = moment(datosAsistencia.fecha).format('YYYY-MM-DD');
    [error, asistencia] = await Asistencia.ObtenerPorCursoAsistenteFecha(idCurso, datosAsistencia.asistente, fechaActual);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error.codigo,
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }
    if(asistencia)
    {
        res.statusCode = 409;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: `Asistente con id ${datosAsistencia.asistente} ya cuenta con registro del dia ${fechaActual}`
            }
        });
    }

    asistencia = new Asistencia(datosAsistencia);
    [error, _] = await asistencia.Crear();
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error.codigo,
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }

    res.statusCode = 201;
    res.send(asistencia);
});


module.exports = router;