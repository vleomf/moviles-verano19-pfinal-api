const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

/* GET users listing. */
router.get('/', async (req, res) => {
  let usuario = new Usuario();

  [error, usuario] = await usuario.ObtenerTodos();
  //  NOTA: Aqui al regresar el error deberia recibir un objeto con
  //  todo lo relacionado al error, el segundo parametro del array
  //  se reservaria SOLAMENTE para el retorno de la informacion de usuario.
  if(error[0] === 'N' || error[0] === 'E')
  {
    res.statusCode = 500;
    return res.json({
      error:{
        codigo: error,
        objetivo: 'GET /usuarios',
        cuerpo: req.body
      }
    });
  }

  return res.send(usuario);
});

router.get('/:id', async(req, res) => {
  let usuario = new Usuario();

  [error, usuario] = await usuario.Obtener(req.params.id);
  if(error[0] === 'N' || error[0] === 'E')
  {
    res.statusCode = 500;
    return res.json({
      error:{
        codigo: error,
        objetivo: `GET /usuarios/${req.params.id}`,
        cuerpo: req.body
      }
    });
  }
  return res.send(usuario);
});

router.post('/', async (req, res) => {
  let usuario = new Usuario(req.body);

  [error, usuario] = await usuario.Crear();
  if(error[0] === 'N' || error[0] === 'E')
  {
    res.statusCode = 500;
    return res.json({
      error:{
        codigo: error,
        objetivo: 'POST /usuarios',
        cuerpo: req.body
      }
    });
  }
  if(error[0] === 'U')
  {
    res.statusCode = 400;
    return res.json({
      error:{
        codigo: error,
        objetivo: 'POST /usuarios',
        cuerpo: req.body,
      },
      validacion: usuario
    })
  }
  res.statusCode = 201;
  return res.send(usuario);
});

router.patch('/:id', async(req, res) =>{
  let usuario = new Usuario(req.body);
  
  [error, usuario] = await usuario.Actualizar(req.params.id);
  if(error[0] === 'N' || error[0] === 'E')
  {
    res.statusCode = 500;
    return res.json({
      error:{
        codigo: error,
        objetivo: `PATCH /usuarios/${req.params.id}`,
        cuerpo: req.body
      }
    })
  }
  if(error[0] === 'U')
  {
    res.statusCode = 400;
    return res.json({
      error:{
        codigo: error,
        objetivo: `PATCH /usuarios/${req.params.id}`,
        cuerpo: req.body
      },
      validacion: usuario
    });
  }

  return res.send(usuario);
});

router.delete('/:id', async(req, res) => {
  let usuario = new Usuario();

  [error, usuario] = await usuario.Eliminar(req.params.id);
  if(error[0] === 'N' || error[0] === 'E')
  {
    res.statusCode = 500;
    return res.json({
      error:{
        codigo: error,
        objetivo: `DELETE /usuarios/${req.params.id}`,
        cuerpo: req.body
      }
    })
  }

  return res.send(usuario);
});



module.exports = router;
