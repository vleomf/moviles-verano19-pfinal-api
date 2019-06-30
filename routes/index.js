var express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');
const Token   = require('../models/Token');

/**
 * @url POST /registrar
 * @requires
 * @param {Usuario} req.body  Datos de usuario
 * @body
 * {
 *    matricula:          < varchar(15)  requerido>
 *    apPaterno:          < varchar(50)  requerido>
 *    apMaterno:          < varchar(50)  requerido>
 *    nombre:             < varchar(100) requerido>
 *    correoElectronico:  < varchar(100) requerido>
 *    rol:                < enum("profesor", "estudiante") >
 *    password:           < varchar(150) requerido>
 * }
 */
router.post('/registrar', async(req, res, next) => {
  const datosUsuario = req.body;
  let nuevoUsuario = new Usuario();

  //  Verificamos que usuario no exista
  [err, usuario] = await Usuario.ObtenerPorCorreo(datosUsuario.correoElectronico);
  if(err)
  {
    switch(err.tipo)
    {
      case 'U':
        res.statusCode = 400;
        break;
      default : 
        res.statusCode = 500;
        break;
    }
    return res.json({
      error: {
        codigo: err.codigo,
        obetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: err.ofensa
      }
    });
  }

  if(usuario)
  {
    res.statusCode = 409;
    return res.json({
      error: {
        codigo: 'U-1000',
        objetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: err.ofensa
      }
    });
  }
  
  //  Validacion exitosa.
  //  Cargamos informacion de usuario enviada en peticion
  
  nuevoUsuario.matricula  = datosUsuario.matricula;
  nuevoUsuario.apPaterno  = datosUsuario.apPaterno;
  nuevoUsuario.apMaterno  = datosUsuario.apMaterno;
  nuevoUsuario.nombre     = datosUsuario.nombre;
  nuevoUsuario.rol        = datosUsuario.rol;
  nuevoUsuario.password   = datosUsuario.password;           
  // nuevoUsuario.fotografia = datosUsuario.fotografia;               Aun no se implementa el manejo de archivos
  nuevoUsuario.correoElectronico = datosUsuario.correoElectronico;

  //  Creamos nuevo usuario
  [err, _] = await nuevoUsuario.Crear();
  if(err)
  {
    switch(err.tipo)
    {
      case 'U':
        res.statusCode = 400;
        break;
      default : 
        res.statusCode = 500;
        break;
    }
    return res.json({
      error: {
        codigo: err.codigo,
        obetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: err.ofensa
      }
    });
  }

  //  Generamos un token de acceso
  [err, token] = await Token.Generar(nuevoUsuario.id);
  if(err)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: 'E-1000',
        objetivo: `${req.method} ${req.url}`,
        cuerpo: req.body
      }
    });
  }


  //  Ocultamos datos privados
  nuevoUsuario.id        = undefined;
  nuevoUsuario.password  = undefined;
  // nuevoUsuario.fotografia = undefined;                         Aun no se implementa manejo de archivos

  res.statusCode = 201;
  return res.json({
    usuario: nuevoUsuario,
    token: token
  });
});

/**
 * @url POST /autorizar
 * @requires
 * @param {matricula} req.body.correoElectronico  Correo de usuario
 * @param {password}  req.body.password           Constraseña de usuario
 * @body
 * {
 *    correoElectronico: < varchar(100) requerido>
 *    password:          < varchar(150) requerido>
 * }
 */

router.post('/autorizar', async(req, res, next) => {
  //  Obtenemos los datos de acceso y validamos
  const datosAcceso = req.body;
  console.log(datosAcceso);
  if(!datosAcceso.correoElectronico || !datosAcceso.password)
  {
    res.statusCode = 400;
    return res.json({
      error: {
        codigo: 'U-1000',
        objetivo: `${req.method} ${req.url}`,
        cuerpo: datosAcceso,
        ofensa: {
          requeridos: {
            correoElectronico: datosAcceso.correoElectronico ? true : false,
            password:  datosAcceso.password  ? true : false
          }
        }
      }
    })
  }

  //  Validacion de peticion correcta. 
  //  Verificamos credenciales 
  [err, usuario] = await Usuario.ObtenerPorCorreo(datosAcceso.correoElectronico);
  if(err)
  {
    switch(err.tipo)
    {
      case 'U':
        res.statusCode = 400;
        break;
      default : 
        res.statusCode = 500;
        break;
    }
    return res.json({
      error: {
        codigo: err.codigo,
        obetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: err.ofensa
      }
    });
  }
  if(!usuario)
  {
    res.statusCode = 404;
    return res.json();
  }
  const esValido = await usuario.ValidarPassword(datosAcceso.password);
  if(!esValido)
  {
    res.statusCode = 401;
    return res.json();
  }

  //  Validacion de usuario completa.
  //  Asignamos token de sesion
  //  Generamos un token de acceso
  [err, token] = await Token.Generar(usuario.id);
  if(err)
  {
    res.statusCode = 500;
    return res.json({
      error: {
        codigo: err.codigo,
        objetivo: `${req.method} ${req.url}`,
        cuerpo: req.body,
        ofensa: err.ofensa
      }
    });
  }
  //  Ocultamos informacion sensible
  usuario.password = undefined;
  res.json({
    usuario: usuario,
    token: token
  });
});

module.exports = router;
