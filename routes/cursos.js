const express = require('express');
const router  = express.Router();
const Acceso  = require('../middlewares/Acceso');
const Curso   = require('../models/Curso');
const Salon   = require('../models/Salon');
const Horario = require('../models/Horario');



/**
 * @param {Curso}     datosCurso        Datos del curso a crear
 * @param {Salon}     datosSalon        Datos del salon asignado
 * @param {horario[]} datosHorarios     Array de Datos de los horarios del curso
 */
router.post('/', Acceso.Profesor, async(req, res) => {
    const datosCurso    = req.body.curso;
    const datosSalon    = req.body.salon;
    const datosHorarios = req.body.horarios;
    
    /** !! VALIDACION JSON !! **/

    let curso = new Curso(datosCurso);
    [error, _] = await curso.Crear();
    if(error)
    {
        switch(error.tipo)
        {
            case 'U' : res.statusCode = 400; break;
            default  : res.statusCode = 500; break;
        }
        return res.json({
            error: {
                codigo: error.codigo,
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: error.ofensa
            }
        });
    }

    let salon;
    //  Asignar salon existente
    if(!datosSalon.id)
    {
        salon = new Salon(datosSalon);
        [error, _] = await salon.Crear();
        if(error)
        {
            switch(error.tipo)
            {
                case 'U' : res.statusCode = 400; break;
                default:   res.statusCode = 500; break;
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
    }
    else
    {
        salon = new Salon();
        salon.id = datosSalon.id;
    }

    for(let i = 0; i < datosHorarios.length; i++)
    {
        if(datosHorarios[i])
        {
            let horario = new Horario(datosHorarios[i]);
            horario.curso = curso.id;
            horario.salon = salon.id;
            [error, _]  = await horario.Crear();
            if(error)
            {
                switch(error.tipo)
                {
                    case 'U' : res.statusCode = 400; break;
                    default  : res.statusCode = 500; break;
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
        }
    }
    
    res.statusCode = 201;
    return res.send();
});

module.exports = router;