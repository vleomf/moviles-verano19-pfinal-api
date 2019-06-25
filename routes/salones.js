const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');

router.get('/', async(req, res) => {
    let salon = new Salon();

    [status, salon] = await salon.ObtenerTodos();
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(salon);
});

router.get('/:id', async(req, res) => {
    let salon = new Salon();
    [status, salon] = await salon.Obtener(req.params.id);
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(salon);
});

router.post('/', async(req, res) => {
    let salon = new Salon(req.body);
    [status, salon] = await salon.Crear();
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 201; break;
    }
    res.send(salon);
});

router.patch('/:id', async(req, res) => {
    let salon = new Salon(req.body);
    [status, salon] = await salon.Actualizar(req.params.id);
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(salon);
});

router.delete('/:id', async(req, res) => {
    let salon = new Salon();
    [status, salon] = await salon.Eliminar(req.params.id);
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(salon);
});

module.exports = router;