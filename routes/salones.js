const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');

router.get('/', async(req, res) => {
    let salon = new Salon();

    [error, salon] = await salon.ObtenerTodos();
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: 'GET /salones',
                cuerpo: req.body
            }
        });
    }

    return res.send(salon);
});

router.get('/:id', async(req, res) => {
    let salon = new Salon();

    [error, salones] = await salon.Obtener(req.params.id);
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `GET /salones/${req.params.id}`,
                cuerpo: req.body
            }
        });
    }

    return res.send(salones);
});

router.post('/', async(req, res) => {
    let salon = new Salon(req.body);

    [error, salon] = await salon.Crear();
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: 'POST /salones',
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
                objetivo: 'POST /salones',
                cuerpo: req.body
            },
            validacion: salon
        })
    }

    res.statusCode = 201;
    return res.send(salon);
});

router.patch('/:id', async(req, res) => {
    let salon = new Salon(req.body);
    
    [error, salon] = await salon.Actualizar(req.params.id);
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `PATCH /salones/${req.params.id}`,
                cuerpo: req.body
            }
        });
    }
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 400;
        return res.json({
            error: {
                codigo: error,
                objetivo: `PATCH /salones/${req.params.id}`,
                cuerpo: req.body
            },
            validacion: salon
        });
    }

    return res.send(salon);
});

router.delete('/:id', async(req, res) => {
    let salon = new Salon();
    
    [status, salon] = await salon.Eliminar(req.params.id);
    if(error[0] === 'N' || error[0] === 'E')
    {
        res.statusCode = 500;
        return res.json({
            error: {
                codigo: error,
                objetivo: `DELETE /salones/${req.params.id}`,
                cuerpo: res.body
            }
        });
    }

    return res.send(salon);
});

module.exports = router;