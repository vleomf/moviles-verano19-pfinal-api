const express = require('express');
const router  = express.Router({mergeParams: true});
const Acceso    = require('../middlewares/Acceso');
const Curso     = require('../models/Curso');
const Salon     = require('../models/Salon');
const Horario   = require('../models/Horario');
const Asistente = require('../models/Asistente');
const Actividad = require('../models/Actividad');
const Jschema   = require('jsonschema').Validator;

//  Obtener todas las actividades de un curso por id
/**
 * @url GET /cursos/:id/actividades
 */
router.get('/', async(req, res) => {
    const idCurso = req.params.id;
    console.log(req.params);

    [error, actividades] = await Actividad.ObtenerTodosPorCurso(idCurso);
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
    
    return res.json(actividades);
});

//  Crear una nueva Actividad a un Curso por id
/**
 * @url POST /cursos/:id/actividades
 * @body
 * {
 *      indice:      < string(10) requerido>
 *      nombre:      < string(50) requerido>
 *      descripcion: < text       requerido>
 * }
 */
router.post('/', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    const datosActividad = req.body;
    
    /** !! INICIA VALIDACION JSON !! **/
    if(!datosActividad)
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: {
                    schema: {
                        "indice" : "string(10), requerido",
                        "nombre" : "string(50), requerido",
                        "descripcion" : "texto, requerido"
                    }
                }
            }
        });
    }

    let validator = new Jschema();
    const datosActividadSchema = {
        "id" : "/Actividad",
        "type" : "object",
        "properties": {
            "indice" : {
                "type" : "string",
                "maxLength": 10,
                "required" : true
            },
            "nombre":{
                "type": "string",
                "maxLength": 50,
                "required" : true
            },
            "descripcion": {
                "type": "string",
                "required": true
            }
        }
    }

    validator.addSchema(datosActividadSchema, '/Actividad');
    const validacion = validator.validate(datosActividad, datosActividadSchema)
    if(validacion.errors.length)
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo:  'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: validacion.errors
            }
        })
    }
    /** !! TERMINA VALIDACION JSON !! **/
    let actividad = new Actividad(datosActividad);
    actividad.curso = idCurso;
    [error, _] = await actividad.Crear();
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }

    res.statusCode = 201;
    return res.json(actividad);
});

//  Actualizar actividades asignada a un Curso por id
/**
 * @url PATCH /cursos/:idCurso/actividades/:idActividad
 * @body
 * {
 *      indice:      < string(10) >
 *      nombre:      < string(50) >
 *      descripcion: < text       >
 * }
 */
router.patch('/:idActividad', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    const idActividad = req.params.idActividad;
    const datosActividad = req.body;

    [error, actividad] = await Actividad.ObtenerPor_id_cursoId(idCurso, idActividad);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }
    if(!actividad)
    {
        res.statusCode = 404;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }
    actividad.nombre = datosActividad.nombre;
    actividad.indice = datosActividad.indice;
    actividad.descripcion = datosActividad.descripcion;
    [error, _] = await actividad.Actualizar();
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        })
    }
    return res.json(actividad);
});

//  Eliminar una Actividad del Curso por id
// router.delete('/:idCurso/actividades/:idActividad', Acceso.Profesor, async(req, res) => {
//     const idCurso = req.params.idCurso;
//     const idActividad = req.params.idActividad;

        /** SE DEBEN ELIMINAR LAS REVISIONES ASOCIADAS A UNA ACTIVIDAD */
// });



module.exports = router;