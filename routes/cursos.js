const express   = require('express');
const router    = express.Router();
const Acceso    = require('../middlewares/Acceso');
const Curso     = require('../models/Curso');
const Salon     = require('../models/Salon');
const Horario   = require('../models/Horario');
const Asistente = require('../models/Asistente');
const Actividad = require('../models/Actividad');
const Jschema   = require('jsonschema').Validator;

// Obtener Todos los Cursos registrados
/**
 * @url GET /cursos
 */
router.get('/', async(req, res) => {
    const hoy = req.query.hoy;
    [error, cursos] = hoy ? await Curso.ObtenerTodosHoy() : await Curso.ObtenerTodos();
    if(err)
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
    return res.json(cursos);
});

//  Obtener curso por id
/**
 * @url GET /cursos/:id
 */
router.get('/:id', async(req, res) => {
    const id = req.params.id;
    if(!id)
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: 'falta id'
            }
        })
    }
    [error, curso] = await Curso.Obtener(id)
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
    [error, horario] = await Horario.ObtenerPorCurso(curso.id);
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
    [error, salon] = await Salon.Obtener(horario[0].salon);
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

    const respuestaCurso = {
        curso: curso,
        horario: horario,
        salon: salon
    }

    return res.json(respuestaCurso);
});

//  Crear un nuevo curso
//  NOTA: Solo el rol profesor puede crear cursos
/**
 * @url POST /cursos/
 * @body
 * {
 *      curso: {
 *          matricula: < string(15)  requerido>
 *          nombre:    < string(255) requerido>
 *          inicio:    < date        requerido>
 *          fin:       < date        requerido>
 *      },
 *      salon:{
 *          id:        < salones.id>     NOTA: Si envias este parametro
 *                                       el resto es ignorado y registra
 *                                       el salon con este id
 *          codigo:      < string(15)  requerido>
 *          edificio:    < string(15)  requerido>
 *          facultad:    < string(100) requerido>
 *          institucion: < string(100) requerido>          
 *      },
 *      horarios: [
 *          {
 *              dia:     < enum("L","A","M","J","V","S","D") requerido>
 *              hora>    < time requerido>
 *          }
 *      ]
 * }
 */
router.post('/', Acceso.Profesor, async(req, res) => {
    const datosCurso    = req.body.curso;
    const datosSalon    = req.body.salon;
    const datosHorarios = req.body.horarios;
    
    /** !! INICIA  VALIDACION JSON **/
    if(!datosCurso || !datosSalon || !datosHorarios) return res.status(400).json({
        error: {
            codigo: 'U-1000',
            objetivo: `${req.method} ${req.url}`,
            cuerpo: req.body,
            ofensa: {
                schema: {
                    "curso" : {
                        "matricula" : "string(15), requerido",
                        "nombre": "string(255), requerido",
                        "inicio": "date, requerido",
                        "fin": "date, requerido"
                    },
                    "salon": {
                        "id": "int, opcional",
                        "codigo": "string(15), requerido",
                        "edificio": "string(15), requerido",
                        "facultad": "string(100), requerido",
                        "institucion": "string(100), requerido"
                    },
                    "horarios": [
                        {
                            "dia": "enum('L', 'A', 'M', 'J', 'V', 'S', 'D'), requerido",
                            "hora": "time, requerido"
                        }
                    ]
                }
            }
        }
    });

    let validator = new Jschema();
    const datosCursoSchema = {
        "id" : "/Curso",
        "type" : "object",
        "properties": {
            "matricula":{
                "type": "string",
                "maxLength": 15,
                "required": true
            },
            "nombre" : {
                "type": "string",
                "maxLength": 255,
                "required": true
            },
            "inicio": {
                "type": "string",
                "format": "date",
                "required": true
            },
            "fin": {
                "type": "string",
                "format" : "date",
                "required": true
            }
        }
    }

    const datosSalonSchema = {
        "id": "/Salon",
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
            },
            "codigo": {
                "type" : "string",
                "maxLength": 15,
                "required": true
            },
            "edificio": {
                "type": "string",
                "maxLength": 15,
                "required": true
            },
            "facultad": {
                "type": "string",
                "maxLength": 100,
                "required": true
            },
            "institucion": {
                "type": "string",
                "maxLength": 100,
                "required": true
            }
        }
    }

    const datosHorariosSchema = {
        "id": "/Horario",
        "type": "object",
        "properties": {
            "dia": {
                "enum": ["L", "A", "M", "J", "V", "S", "D"]
            }
        }
    }

    const datosHorariosSchemaArray = {
        "id": "/Horarios",
        "type": "array",
        "items": {
            "$ref": "/Horario"
        }
    }

    const datosSchema = {
        "id": "/PeticionCurso",
        "type": "object",
        "properties":{
            "curso": {
                "$ref" : "/Curso"
            },
            "horarios": {
                "$ref": "/Horarios"
            }
        }
    }

    const datosPeticion = {
        curso: datosCurso,
        salon: datosSalon,
        horarios: datosHorarios
    }

    validator.addSchema(datosCursoSchema, '/Curso');
    if(!datosSalon.id)
    {
        validator.addSchema(datosSalonSchema, '/Salon');
        datosSchema['properties']['salon'] = { "$ref": "/Salon" };
    }
    validator.addSchema(datosHorariosSchema, '/Horario');
    validator.addSchema(datosHorariosSchemaArray, '/Horarios');
    validator.addSchema(datosSchema, '/PeticionCurso')
    const validacion = validator.validate(datosPeticion, datosSchema)
    if(validacion.errors.length)
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: validacion.errors
            }
        })
    }

    /** !! TERMINA VALIDACION JSON **/
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

    let asistente = new Asistente();
    asistente.curso   = curso.id;
    asistente.usuario = res.locals.idUsuario; 
    [error, _] = await asistente.Crear();
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
    
    res.statusCode = 201;
    return res.send();
});

//  Actualizar curso por id
/**
 * @url PATCH /cursos/:id
 * @body
 * {
 *      curso: {
 *          matricula: < string(15)  >
 *          nombre:    < string(255) >
 *          inicio:    < date        >
 *          fin:       < date        >
 *      },
 *      salon:{
 *          codigo:      < string(15)  >
 *          edificio:    < string(15)  >
 *          facultad:    < string(100) >
 *          institucion: < string(100) >          
 *      },
 *      horarios: [
 *          {
 *              dia:     < enum("L","A","M","J","V","S","D") >
 *              hora>    < time >
 *          }
 *      ]
 * }
 */

router.patch('/:id', Acceso.Profesor, async(req, res) => {
    const idCurso      = req.params.id;
    const datosCurso   = req.body.curso;
    const datosSalon   = req.body.salon;
    const datosHorario = req.body.horarios;

    [error, horarios] = await Horario.ObtenerPorCurso(idCurso);
    if(error)
    {
        console.log(1);
        
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
    if(!horarios)
    {
        res.statusCode = 404;
        return res.json();
    }
    let idSalon = horarios[0].salon;
    if(datosCurso)
    {
        let curso = new Curso(datosCurso);
        curso.id = idCurso;
        [error, _] = await curso.Actualizar();
        if(error)
        {
            console.log(2);
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
    if(datosSalon)
    {
        let salon = new Salon(datosSalon);
        salon.id = idSalon;
        [error, _] = await salon.Actualizar();
        if(error)
        {
            console.log(3);
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

    if(datosHorario)
    {
        [error, _] = await Horario.EliminarDeCurso(idCurso);
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
        datosHorario.forEach(async horario => {
            let nuevoHorario = new Horario(horario);
            nuevoHorario.curso = idCurso;
            nuevoHorario.salon = idSalon;
            [err, _] = await nuevoHorario.Crear();
            if(err)
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
        });
    }

    return res.json({
        curso: datosCurso,
        salon: datosSalon,
        horario: datosHorario
    })
});

//  Eliminar Curso por id
/**
 * @url DELETE /cursos/:id
 */
router.delete('/:id', Acceso.Profesor, async(req, res) => {
    const idCurso = req.params.id;
    [error, _] = await Horario.EliminarDeCurso(idCurso);
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
    [error, curso] = await Curso.Obtener(idCurso);
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
    asistentes.forEach(asistente => {
        asistente.Eliminar();
    });
    [error, _] = await curso.Eliminar();
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
    return res.json();
});

module.exports = router;