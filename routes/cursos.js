const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');

router.get('/', async(req, res) => {
    let curso = new Curso();

    [status, curso] = await curso.ObtenerTodos();
    switch(status.error)
    {
        case 'db' : res.statusCode = 500; break;
        default   : res.statusCode = 200; break;
    }

    res.send(curso);
});

router.get('/:id', async(req, res) => {
    let curso = new Curso();

    [status, curso] = await curso.Obtener(req.params.id);
    switch(status.error)
    {
        case 'db'  : res.statusCode = 500; break;
        case 'usr' : res.statusCode = 400; break;
        default    : res.statusCode = 200; break;
    }

    res.send(curso);
});

router.post('/', async(req, res) => {
    let curso = new Curso(req.body);

    [status, curso] = await curso.Crear();
    switch(status.error)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }

    res.send(curso);
});

router.patch('/:id', async(req, res) => {
    let curso = new Curso(req.body);

    [status, curso] = await curso.Actualizar(req.params.id);
    switch(status.error)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }
    res.send(curso);
});

router.delete('/:id', async(req, res) => {
    let curso =  new Curso();

    [status, curso] = await curso.Eliminar(req.params.id);
    switch(status.error)
    {
        case 'db' : res.statusCode = 500; break;
        case 'usr': res.statusCode = 400; break;
        default   : res.statusCode = 200; break;
    }

    res.send(curso);
});

module.exports = router;