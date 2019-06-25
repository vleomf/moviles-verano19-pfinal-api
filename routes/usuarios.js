const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

/* GET users listing. */
router.get('/', async (req, res) => {
  let usuario = new Usuario();

  [status, usuario] = await usuario.ObtenerTodos();
  switch(status.error)
  {
    case 'db': res.statusCode = 500; break;
    default  : res.statusCode = 200; break;
  }

  res.send(usuario);
});

router.get('/:id', async(req, res) => {
  let usuario = new Usuario();

  [status, usuario] = await usuario.Obtener(req.params.id);
  switch(status.error)
  {
    case 'db':  res.statusCode = 500; break;
    case 'usr': res.statusCode = 400; break;
  }
  res.send(usuario);
});

router.post('/', async (req, res) => {
  let usuario = new Usuario(req.body);

  [status, usuario] = await usuario.Crear();
  switch(status.error)
  {
    case 'db' : res.statusCode = 500; break;
    case 'usr': res.statusCode = 400; break;
    default   : res.statusCode = 201; break;
  }
  
  res.send(usuario);
});

router.patch('/:id', async(req, res) =>{
  let usuario = new Usuario(req.body);
  
  [status, usuario] = await usuario.Actualizar(req.params.id);
  switch(status.error)
  {
    case 'db'  : res.statusCode = 500; break;
    case 'usr' : res.statusCode = 400; break;
  }
  res.send(usuario);
});

router.delete('/:id', async(req, res) => {
  let usuario = new Usuario();

  [status, usuario] = await usuario.Eliminar(req.params.id);
  switch(status.error)
  {
    case 'db' : res.statusCode = 500; break;
    case 'usr': res.statusCode = 400; break;
    default   : res.statusCode = 201; break;
  }

  res.send(usuario);
});

module.exports = router;
