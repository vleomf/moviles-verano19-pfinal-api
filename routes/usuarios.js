const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Acceso = require('../middlewares/Acceso');


//  Obtener informacion de usuarios
/**
 * @url GET /usuarios
 */
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

//  Obtener informacion especifica de usuario por id
/**
 * @url GET /usuarios/:id
 */
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

//  Actualizar informacion de usuario
//  NOTA: Se permite actualizar si el id coincide con el 
//  TOKEN enviado en la peticion.
/**
 * @url PATCH /usuarios/:id
 * @body
 * {
 *    matricula:          < varchar(15) >
 *    apPaterno:          < varchar(50) >
 *    apMaterno:          < varchar(50) >
 *    nombre:             < varchar(100)>
 *    correoElectronico:  < varchar(100)>
 *    rol:                < enum("profesor", "estudiante") >
 *    password:           < varchar(150)>
 * }
 */
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

//  Borrar un usuario por ID
//  NOTA: SOlo el usuario propietario puede eliminar su 
//  cuenta. Se toma el id del TOKEN registrado ppor seguridad.
/**
 * @url DELETE /usuarios/:id
 */
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
