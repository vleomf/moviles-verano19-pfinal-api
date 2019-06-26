const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');
const Asistente = require('../models/Asistente');

router.get('/', async(req, res) => {
    let curso = new Curso();

    [error, curso] = await curso.ObtenerTodos();
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        });
    }

    return res.send(curso);
});

router.get('/:id', async(req, res) => {
    let curso = new Curso();

    [error, curso] = await curso.Obtener(req.params.id);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        });
    }

    return res.send(curso);
});

router.post('/', async(req, res) => {
    let curso = new Curso(req.body);

    [error, curso] = await curso.Crear();
    if(error)
    {
        let respuesta = {
            error: {
                codigo: error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        }
        switch(error)
        {
            case (error[0] === 'U'): 
                res.statusCode = 400;
                respuesta['validacion'] = curso;
                break;
            default:
                res.statusCode = 500;
        }
        return res.json(respuesta);
    }

    res.statusCode = 201;
    return res.send(curso);
});

router.patch('/:id', async(req, res) => {
    let curso = new Curso(req.body);

    [error, curso] = await curso.Actualizar(req.params.id);
    if(error)
    {
        let respuesta = {
            error: {
                codigo: error,
                objetivo : `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        };
        switch(error)
        {
            case (error[0] === 'U'):
                res.statusCode = 400;
                respuesta['validacion'] = curso;
                break;
            default:
                res.statusCode = 500;
        }
        return res.json(respuesta);
    }

    return res.send(curso);
});

router.delete('/:id', async(req, res) => {
    let curso =  new Curso();

    [error, curso] = await curso.Eliminar(req.params.id);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo : error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        });
    }

    return res.send(curso);
});

router.get('/:id/asistentes', async(req, res) => {
    let curso = new Curso();
    let asistente = new Asistente();

    [error, curso] = await curso.Obtener(req.params.id);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        });
    }
    [error, asistentes]  = await asistente.ObtenerTodos(req.params.id);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        });
    }

    return res.json({
        curso: curso,
        asistentes : asistentes
    });
});

router.get('/:idCurso/asistentes/:idAsistente', async(req, res) => {
    let curso = new Curso();
    let asistente = new Asistente();
    const idCurso = req.params.idCurso;
    const idAsistente = req.params.idAsistente;

    [error, curso] = await curso.Obtener(idCurso);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        })
    }
    [error, asistente] = await asistente.Obtener(idAsistente, idCurso);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `${req.method} ${req.baseUrl}`,
                cuerpo: req.body
            }
        })
    }
   
    return res.json({
        curso: curso,
        asistente: asistente
    });
}); 

module.exports = router;