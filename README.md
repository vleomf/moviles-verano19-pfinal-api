# Proyecto Final (API)

Requisitos

* PHP 7 o mayor
* MARIADB

### Instrucciones en MARIA DB

1) Crear base de datos de la aplicacion.
> CREATE DATABASE pfinal_db;

2)Crear usuario y asignarle permisos a nuestra base de datos.
> CREATE USER 'admin'@'localhost' identified by 'contrasena';

3) Otorgar permisos a base de datos a nuestro usuario.
> GRANT ALL PRIVILEGES ON pfinal_db.* TO 'admin'@'localhost';

4) Refrescar tabla de privilegios.
> FLUSH PRIVILEGES;

5) Salir de MariaDB e ir a la carpeta de migraciones
> exit
> cd migraciones

6) Correr migracion
> mysql -u admin -p pfinal_db < migracion-01.sql

<hr/>

### Instrucciones de Aplicacion

1) Hacer una copia del archivo 'config/config.ini.ejemplo' en el mismo directorio (NO BORRAR NI RENOMBRAR !!!!).

2) Introducir datos de tu configuracion de base de datos.

3) Posicionarse mediante la terminal (o linea de comandos en Windows) en el directorio 'www'.
> cd www

4) Correr servidor de desarrollo con PHP
> php -S localhost:8080
