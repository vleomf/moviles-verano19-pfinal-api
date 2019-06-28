CREATE TABLE tokens(
    id  INT NOT NULL PRIMARY KEY,
    fecha_creacion DATETIME NOT NULL,
    expiracion     DATETIME NOT NULL,
    token          TEXT NOT NULL
);