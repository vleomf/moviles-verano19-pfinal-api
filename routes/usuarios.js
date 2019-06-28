const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Acceso = require('../middlewares/Acceso');


router.get('/', async (req, res) => {
  [error, usuario] = await Usuario.ObtenerTodos();
  if(error)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }

  return res.send(usuario);
});

router.get('/:id', async(req, res) => {
  [error, usuario] = await Usuario.Obtener(req.params.id);
  if(!usuario)
  {
    res.statusCode = 404;
    return res.json();
  }
  if(error)
  {
    switch(error.tipo)
    {
      case 'E' : res.statusCode = 500; break;
      case 'N' : res.statusCode = 500; break;
    }
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }
  return res.send(usuario);
});


router.patch('/:id', Acceso.InformacionPersonal ,async(req, res) =>{
  let datosUs = req.body;

  [error, usuario] = await Usuario.Obtener(req.params.id);
  if(error)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.url}`,
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
  
  [error, _] = await usuario.Actualizar();
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
        objetivo: `${req.method} ${req.url}`,
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

router.delete('/:id', Acceso.InformacionPersonal, async(req, res) => {
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
        objetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }

  [error, _] = await usuario.Eliminar();
  if(error)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: error.codigo,
        objetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: error.ofensa
      }
    });
  }

  return res.send(usuario);
});



module.exports = router;
