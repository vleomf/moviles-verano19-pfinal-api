const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');
const Asistente = require('../models/Asistente');

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

router.get('/:id/asistentes', async(req, res) => {
    let curso = new Curso();
    let asistente = new Asistente();

    [status1, curso] = await curso.Obtener(req.params.id);
    [status2, asistentes]  = await asistente.ObtenerTodos(req.params.id);
    if( !status1.error && !status2 )
    {
        res.statusCode = 200; 
    }
    else
    {
        switch(status1.error)
        {
            case 'db' : res.statusCode = 500; break;
            case 'usr': res.statusCode = 400; break;
        }
        switch(status2)
        {
            case 'db' : res.statusCode = 500; break;
            case 'usr': res.statusCode = 400; break;
        }
    }

    res.json({
        curso: curso,
        asistentes : []
    });
});

router.get('/:idCurso/asistentes/:idAsistente', async(req, res) => {
    let curso = new Curso();
    let asistente = new Asistente();
    const idCurso = req.params.idCurso;
    const idAsistente = req.params.idAsistente;

    [status1, curso] = await curso.Obtener(idCurso);
    [status2, asistente] = await asistente.Obtener(idAsistente, idCurso);
    if( !status1.error && !status2)
    {
        res.statusCode = 200;
    }
    else
    {
        res.statusCode = 500;
    }

    res.json({
        curso: curso,
        asistente: asistente
    });

}); 

module.exports = router;