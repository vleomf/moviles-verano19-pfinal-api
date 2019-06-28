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

//  Obtener asistencias del Curso
router.get('/', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    let listaAsistencia = [];
    //  1) Obtenemos asistentes del curso
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

    asistentes.forEach( async asistente => {
        [error, asistencias] = await Asistencia.ObtenerPorAsistente(asistente.id);
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
        listaAsistencia.push({
            asistente: asistente,
            asistencias: asistencias
        });
    })
    return res.json(listaAsistencia);
});

//  Registrar asistencia a un Estudiante por Curso
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

    // let asistencia = new Asistencia(datosAsistencia);
    // [error, _] = await asistencia.Crear();
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

    // res.statusCode = 201;
    // res.send(asistencia);
});


module.exports = router;