const express = require('express');
const router  = express.Router();
const Horario = require('../models/Horario');

router.get('/', async(req, res) => {
    let horario = new Horario();
    [status, horario] = await horario.ObtenerTodos();
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(horario);
})

router.get('/:id', async(req, res) => {
    let horario = new Horario();
    [status, horario] = await horario.Obtener(req.params.id);
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(horario);
});

router.post('/', async(req, res) => {
    let horario = new Horario(req.body);
    [status, horario] = await horario.Crear();
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 201; break;
    }
    res.send(horario);
});

router.patch('/:id', async(req, res) => {
    let horario = new Horario(req.body);
    [status, horario] = await horario.Actualizar(req.params.id);
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(horario);
});

router.delete('/:id', async(req, res) =>{
    let horario = new Horario();
    [status, horario] = await horario.Eliminar(req.params.id);
    switch(status)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(salon);
});

module.exports = router;