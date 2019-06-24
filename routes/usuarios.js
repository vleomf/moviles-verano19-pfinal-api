const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let usuario = new Usuario();
  let respuesta;

  [status, respuesta] = await usuario.Obtener();
  switch(status.error)
  {
    case 'db': res.statusCode = 500; break;
    default  : res.statusCode = 200; break;
  }
  res.send(respuesta);
});

router.post('/', async (req, res, next) => {
  let usuario = new Usuario(req.body);
  let respuesta;

  [status, respuesta] = await usuario.Crear();
  switch(status.error)
  {
    case 'db' : res.statusCode = 500; break;
    case 'usr': res.statusCode = 400; break;
    default   : res.statusCode = 201; break;
  }
  
  res.send(respuesta);
});

module.exports = router;
