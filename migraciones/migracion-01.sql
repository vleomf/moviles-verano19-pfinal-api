CREATE TABLE `usuarios` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`matricula` varchar(15) NOT NULL,
	`ap_paterno` varchar(50) NOT NULL,
	`ap_materno` varchar(50) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`correo_electronico` varchar(100) NOT NULL,
	`fotografia` varchar(250),
	`rol` ENUM('profesor', 'estudiante') NOT NULL,
	`password` varchar(150),
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
	`dia` varchar(1) NOT NULL,
	`hora` TIME NOT NULL,
	`salon` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `salones` (
	`id` INT NOT NULL AUTO_INCREMENT,
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

ALTER TABLE `horarios` ADD CONSTRAINT `horarios_fk1` FOREIGN KEY (`salon`) REFERENCES `salones`(`id`);

ALTER TABLE `asistencia` ADD CONSTRAINT `asistencia_fk0` FOREIGN KEY (`asistente`) REFERENCES `asistentes`(`id`);

ALTER TABLE `actividades` ADD CONSTRAINT `actividades_fk0` FOREIGN KEY (`curso`) REFERENCES `cursos`(`id`);

ALTER TABLE `revisiones` ADD CONSTRAINT `revisiones_fk0` FOREIGN KEY (`actividad`) REFERENCES `actividades`(`id`);

ALTER TABLE `revisiones` ADD CONSTRAINT `revisiones_fk1` FOREIGN KEY (`asistente`) REFERENCES `asistentes`(`id`);

