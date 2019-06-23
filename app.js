/// REQUERIMOS LOS MODULOS INSTALADOS DESDE NPM NECESARIOS PARA CONFIGURAR NUESTRA APLICACION.
var createError = require('http-errors');               // MODULO DE MANEJO DE ERRORES
var express = require('express');                       // MODULO DE EXPRESS. NUESTRO FRAMEWORK.
var path = require('path');                             // MODULO PARA ACCEDER A RUTAS DENTRO DEL PROYECTO.
var cookieParser = require('cookie-parser');            // MODULO PARA PARSEAR COOKIES.
var logger = require('morgan');                         // MODULO PARA MOSTRAR ERRORES DE FORMA CLARA EN MODO DESARROLLO.

/// REQUERIMOS LOS MODULOS LOCALES.
var indexRouter = require('./controladores/index');

/// INICIALIZAMOS NUESTRA APLICACION EXPRESS.
var app = express();

/// CONFIGURACION DE MIDDLEWARES. LOS MIDDLEWARES A CONFIGURAR A PARTIR DE ESTA SECCION
/// SON UTILIZADOS GLOBALMENTE POR LA APLICACION. 
/// EL ORDEN DE LA DECLARACION DEL MIDDLEWARE ES IMPORTANTE.
app.set('views', path.join(__dirname, 'vistas'));         // CONFIGURAMOS EL DIRECTORIO DE VISTAS.
app.set('view engine', 'hbs');                            // CONFIGURAMOS EL MOTOR DE PLANTILLAS. [https://handlebarsjs.com/]
app.use(logger('dev'));                                   // CONFIGURAMOS EL LOGUEADOR, PARA MOSTRAR ERRORES EN MODO DESARROLLO.
app.use(express.json());                                  // CONFIGURAMOS EL USO DE JSON EN LA APLICACION
app.use(express.urlencoded({ extended: false }));         // CONFIGURAMOS LA CODIFICACION DE URL'S
app.use(cookieParser());                                  // CONFIGURAMOS EL PARSEADOR DE COOKIES
app.use(express.static(path.join(__dirname, 'public')));  // CONFIGURAMOS LA RUTA PUBLICA.

/// CONFIGURAMOS LOS PUNTOS DE ACCESO DE LA APLICACION.
/// DEFINIMOS LA RUTA DE ENTRADA Y ASIGNAMOS LOS MODULOS LOCALES
//  QUE CONTIENEN LAS DEFINICIONES DEL CONTROLADOR.
app.use('/', indexRouter);

/// CONFIGURAMOS EL PUNTO DE ACCESO POR DEFAULT.
/// SI NINGUNA RUTA ARRIBA ES VALIDA ESTE MIDDLEWARE SE ENCARGA
/// DE MANDAR EL ERROR 404 - NOT FOUND 
app.use(function(req, res, next) {
  next(createError(404));
});

/// CONFIGURAMOS EL MANEJO DE ERRORES EN SERVIDOR.
/// SI EXISTE ALGUN ERROR DE EJECUCION EN SERVIDOR SE EJECUTA
/// EL SIGUIENTE MIDDLEWARE.
app.use(function(err, req, res, next) {
  /// SE ASIGNAN VALORES DE ERROR SOLO PARA MOSTRAR EN MODO DESARROLLO
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  /// SE MUESTRA LA PAGINA DE ERROR PARA MODO PRODUCCION
  res.status(err.status || 500);
  res.render('error');
});

/// EN NODE JS TODO ES UN MODULO. EXPORTAMOS EL MODULO APP PARA QUE EL ARCHIVO
/// bin/www EJECUTE EL SERVIDOR CON ESTAS CONFIGURACIONES
module.exports = app;
