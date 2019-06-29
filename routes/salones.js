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

//  Obtener todos los salones registrados
/**
 *  @url GET /salones
 */
router.get('/', async(req, res) => {
    [error, salones] = await Salon.ObtenerTodos();
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: 'E-1000',
                objetivo: 'GET /salones',
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        });
    }
    return res.send(salones);
});

//  Obtener todos los salones por facultad
/**
 *  @url GET /salones/:facultad
 * 
 *  NOTA: *facultad
 *        Generada del catalogo, nombre de facultad
 */
router.get('/:facultad', async(req, res) => {
    const facultad = req.params.facultad;
    [error, salones] = await Salon.ObtenerTodosPorFacultad(facultad);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: 'E-1000',
                objetivo: 'GET /salones',
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        });
    }
    return res.send(salones);
});

module.exports = router;