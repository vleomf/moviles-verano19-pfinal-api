const express = require('express');
const router  = express.Router({mergeParams: true});
const Acceso    = require('../middlewares/Acceso');
const Curso     = require('../models/Curso');
const Salon     = require('../models/Salon');
const Horario   = require('../models/Horario');
const Asistente = require('../models/Asistente');
const Actividad = require('../models/Actividad');
const Usuario   = require('../models/Usuario');
const Jschema   = require('jsonschema').Validator;

//  Obtener Asistentes de Curso
router.get('/', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    [error, asistentes] = await Asistente.ObtenerPorCurso(idCurso);
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

    return res.json(asistentes);
});

//  Registrar nuevo Asistente a Curso
router.post('/', async(req, res) => {
    const idUsuario = res.locals.idUsuario;
    const idCurso = req.params.id;

    [error, usuario] = await Asistente.ObtenerUsuarioPorCurso(idCurso, idUsuario);
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
    if(usuario)
    {
        res.statusCode = 409;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: "Usuario ya ha sido registrado al curso"
            }
        });
    }

    let asistente = new Asistente();
    asistente.curso = idCurso;
    asistente.usuario = idUsuario;
    [error, _] = await asistente.Crear();
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
    [error, cursoRegistrado] = await Curso.Obtener(idCurso);
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
    [error, usuario] = await Usuario.Obtener(idUsuario);
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

    //  Ocultamos informacion sensible
    usuario.password = undefined;
    usuario.fotografia = undefined;

    res.statusCode = 201;
    return res.json({
        usuario: usuario,
        curso: cursoRegistrado
    });
});

module.exports = router;