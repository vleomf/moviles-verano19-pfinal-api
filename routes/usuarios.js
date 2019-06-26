const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

/* GET users listing. */
router.get('/', async (req, res) => {
  [error, usuario] = await Usuario.ObtenerTodos();
  if(error)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.baseUrl}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }

  return res.send(usuario);
});

router.get('/:id', async(req, res) => {
  [error, usuario] = await Usuario.Obtener(req.params.id);
  if(error)
  {
    switch(error.tipo)
    {
      case 'U' : res.statusCode = 404; break;
      case 'E' : res.statusCode = 500; break;
      case 'N' : res.statusCode = 500; break;
    }
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.baseUrl}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }
  return res.send(usuario);
});

router.post('/', async (req, res) => {
  let usuario = new Usuario(req.body);

  error = await usuario.Crear();
  if(error)
  {
    switch(error.tipo)
    {
      case 'U' : 
        res.statusCode = 400; 
        break;
      case 'E' : 
      case 'N' :
        res.statusCode = 500;
        break;
    }
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.baseUrl}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }

  //  Ocultamos estos datos al publico
  usuario.password   = undefined;
  usuario.fotografia = undefined;
  
  res.statusCode = 201;  
  return res.send(usuario);
});

router.patch('/:id', async(req, res) =>{
  let datosUs = req.body;

  [error, usuario] = await Usuario.Obtener(req.params.id);
  if(error)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.baseUrl}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    })
  }
  
  usuario.matricula  = datosUs.matricula;
  usuario.apPaterno  = datosUs.apPaterno;
  usuario.apMaterno  = datosUs.apMaterno;
  usuario.nombre     = datosUs.nombre;
  usuario.rol        = datosUs.rol;
  usuario.password   = datosUs.password;
  usuario.fotografia = datosUs.fotografia;
  usuario.correoElectronico = datosUs.correoElectronico;
  
  error = await usuario.Actualizar();
  if(error)
  {
    switch(error.tipo)
    {
      case 'U':
        res.statusCode = 400;
        break;
      default:
        res.statusCode = 500;
    }
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.baseUrl}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    })
  }

  //  Ocultamos estos datos al publico
  usuario.password   = undefined;
  usuario.fotografia = undefined;
  
  return res.send(usuario);
});

router.delete('/:id', async(req, res) => {
  [error, usuario] = await Usuario.Obtener(req.params.id);
  if(error)
  {
    switch(error.tipo)
    {
      case 'U' : res.statusCode = 404; break;
      case 'E' : case 'N' :
        res.statusCode = 500; 
        break;
    }
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.baseUrl}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }

  error = await usuario.Eliminar();
  if(error)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.baseUrl}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }

  return res.send(usuario);
});



module.exports = router;
