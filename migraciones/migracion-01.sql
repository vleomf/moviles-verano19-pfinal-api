-- ARCHIVO DE MIGRACION INICIAL
-- DESDE TERMINAL CORRER EL COMANDO
-- mysql -u [usuario] -p < migracion-01.sql

DROP DATABASE IF EXISTS `moviles_pf`;
CREATE DATABASE `moviles_pf`;
USE `moviles_pf`;

CREATE TABLE `usuarios` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`matricula` varchar(15) NOT NULL,
	`ap_paterno` varchar(50) NOT NULL,
	`ap_materno` varchar(50) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`correo_electronico` varchar(100) NOT NULL,
	`fotografia` varchar(250),
	`rol` enum('estudiante', 'profesor') NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `cursos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`matricula` varchar(15) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`inicio` DATE NOT NULL,
	`fin` DATE NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `asistentes` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`usuario` INT NOT NULL,
	`curso` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `horarios` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`curso` INT NOT NULL,
	`dia` enum('L', 'A', 'M', 'J', 'V', 'S', 'D') NOT NULL,
	`hora` TIME NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `salones` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`curso` INT NOT NULL,
	`codigo` varchar(15) NOT NULL,
	`edificio` varchar(15) NOT NULL,
	`facultad` varchar(100) NOT NULL,
	`institucion` varchar(100) NOT NULL,
	`latitud` varchar(25),
	`longitud` varchar(25),
	PRIMARY KEY (`id`)
);

CREATE TABLE `asistencia` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`asistente` INT NOT NULL,
	`fecha` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `actividades` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`curso` INT NOT NULL,
	`nombre` varchar(50) NOT NULL,
	`indice` varchar(10) NOT NULL,
	`descripcion` TEXT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `revisiones` (
	`actividad` INT NOT NULL,
	`asistente` INT NOT NULL,
	`observaciones` TEXT,
	`calificacion` FLOAT
);

ALTER TABLE `asistentes` ADD CONSTRAINT `asistentes_fk0` FOREIGN KEY (`usuario`) REFERENCES `usuarios`(`id`);

ALTER TABLE `asistentes` ADD CONSTRAINT `asistentes_fk1` FOREIGN KEY (`curso`) REFERENCES `cursos`(`id`);

ALTER TABLE `horarios` ADD CONSTRAINT `horarios_fk0` FOREIGN KEY (`curso`) REFERENCES `cursos`(`id`);

ALTER TABLE `salones` ADD CONSTRAINT `salones_fk0` FOREIGN KEY (`curso`) REFERENCES `cursos`(`id`);

ALTER TABLE `asistencia` ADD CONSTRAINT `asistencia_fk0` FOREIGN KEY (`asistente`) REFERENCES `asistentes`(`id`);

ALTER TABLE `actividades` ADD CONSTRAINT `actividades_fk0` FOREIGN KEY (`curso`) REFERENCES `cursos`(`id`);

ALTER TABLE `revisiones` ADD CONSTRAINT `revisiones_fk0` FOREIGN KEY (`actividad`) REFERENCES `actividades`(`id`);

ALTER TABLE `revisiones` ADD CONSTRAINT `revisiones_fk1` FOREIGN KEY (`asistente`) REFERENCES `asistentes`(`id`);

