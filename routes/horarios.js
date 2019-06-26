const express = require('express');
const router  = express.Router();
const Horario = require('../models/Horario');

router.get('/', async(req, res) => {
    let horario = new Horario();
    
    [error, horario] = await horario.ObtenerTodos();
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: 'GET /horarios',
                cuerpo: req.body
            }
        });
    }
    
    return res.send(horario);
})

router.get('/:id', async(req, res) => {
    let horario = new Horario();
    
    [error, horario] = await horario.Obtener(req.params.id);
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `GET /horarios/${req.params.id}`,
                cuerpo: req.body
            }
        });
    }

    return res.send(horario);
});

router.post('/', async(req, res) => {
    let horario = new Horario(req.body);
    
    [error, horario] = await horario.Crear();
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: 'POST /horarios',
                cuerpo: req.body
            }
        });
    }
    if(error[0] === 'U')
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo: error,
                objetivo: 'POST /horarios',
                cuerpo: req.body
            },
            validacion: horario
        });
    }

    res.statusCode = 201;
    return res.send(horario);
});

router.patch('/:id', async(req, res) => {
    let horario = new Horario(req.body);

    [error, horario] = await horario.Actualizar(req.params.id);
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `PATCH /horarios/${req.params.id}`,
                cuerpo: req.body
            }
        });
    }
    if(error[0] === 'U')
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo: error,
                objetivo: `PATCH /horarios/${req.params.id}`,
                cuerpo: req.body
            },
            validacion: horario
        });
    }

    return res.send(horario);
});

router.delete('/:id', async(req, res) =>{
    let horario = new Horario();
    
    [error, horario] = await horario.Eliminar(req.params.id);
    if(error)
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `DELETE /horarios/${req.params.id}`,
                cuerpo: req.body
            }
        });
    }

    res.send(horario);
});

module.exports = router;