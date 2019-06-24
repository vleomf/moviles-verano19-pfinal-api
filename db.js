const db = require('mariadb');
const dbconf = require('./db.conf.json');
exports.Iniciar = function()
{
    return new Promise((resolve, reject) => {
        db.createConnection(dbconf)
        .then( conn => {
            resolve(conn);
        })
        .catch( err => {
            reject(err);
        });
    });
}