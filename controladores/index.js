/// REQUERIMOS LOS MODULOS GLOBALES NECESARIOS PARA
/// INICIAR LA CONFIGURACION DE NUESTRO ROUTER.
const express = require('express');                 // MODULO EXPRESS. EL FRAMEWORK QUE USAMOS.
const router = express.Router();                    // INSTANCIA DE ROUTER.

/// REQUERIMOS LOS MODULOS LOCALES.
const Usuario = require('../modelos/Usuario');

/// GET /
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  let usuario = new Usuario('1234567', 'Muñoz', 'Flores', 'Leopoldo');
  res.send(usuario.Saludar());
});

/// EXPORTAMOS EL MODULO.
module.exports = router;
