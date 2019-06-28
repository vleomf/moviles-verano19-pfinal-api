const Token = require('../models/Token');
const Usuario = require('../models/Usuario');
const moment = require('moment');
/**
 * Middleware para permitir acceso a funcionalidades
 * que requieren de token.
 */
 exports.Autorizar = async (req, res, next) => {
    let token = req.header('X-API-KEY');
    if(!token)
    {
        res.statusCode = 401;
        return res.json({
            error: {
                codigo: 'U-1000',
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: {
                    token: null
                }
            }
        })
    }
    [err,verif] = await Token.Verificar(token);
    
    if(err)
    {
        switch(err.tipo)
        {
            case 'U' : res.statusCode = 400;
            default  : res.statusCode = 500; 
        }
        return res.json({
            error: {
                codigo: err.codigo,
                objetivo: `${req.method} ${req.url}`,
                cuerpo: req.body,
                ofensa: err.ofensa
            }
        })
    }
    if(!verif)
    {
        res.statusCode = 401;
        return res.send('ACCESO NO AUTORIZADO');
    }
    
    //  Verificamos vigencia de token
    let horaActual = moment();
    let expiracion = moment(verif['expiracion']);
    if(horaActual > expiracion)
    {
        res.statusCode = 401;
        return res.send('TOKEN HA EXPIRADO');
    }

    //  Asignamos id usuario a peticion
    res.locals.idUsuario = verif['id'];
    next();
 }

 exports.InformacionPersonal = async(req, res, next) => {
    if(req.params.id != res.locals.idUsuario)
    {
        res.statusCode = 401;
        return res.send('ACCESO NO AUTORIZADO');
    }
    next();
 }

 exports.Profesor = async(req, res, next) => {
    [error, usuario] = await Usuario.Obtener(res.locals.idUsuario);
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
    if(usuario.rol !== 'profesor')
    {
        res.statusCode = 401;
        return res.send('ACCESO NO AUTORIZADO');
    }
    next();
 }
