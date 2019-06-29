# Proyecto Final (API)

---
  ```yaml
    ##  Registrar nuevo usuario
    ##  POST /registrar
   
    # Cuerpo   
    matricula:         string(15)  requerido
    apPaterno:         string(50)  requerido
    apMaterno:         string(50)  requerido
    nombre:            string(100) requerido
    correoElectronico: string(100) requerido
    
    # Respuestas http
    400: Peticion Mal Formada   
    500: Error de Servidor      
    409: Conflicto              
    201: Creado                 
  ```
---
  ```yaml
    ##  Autorizar acceso
    ##  POST /autorizar
    
    # Cuerpo
    correoElectronico: string(100) requerido
    password:          string(150) requerido
    
    # Respuestas HTTP
    400: Peticion Mal Formada   
    500: Error de Servidor      
    404: Recurso no encontrado  
    401: No autorizado          
    200: Ok                     
  ```
---
```yaml
  ##  Ver Usuarios
  ##  GET /usuarios
  
  # Cabeceras
  x-api-key: TOKEN
  
  # Respuestas HTTP
  500: Error de Servidor
  200: Ok
```
---
```yaml
  ##  Ver Usuario por :id
  ##  GET /usuarios/:id
  
  # Cabeceras
  x-api-token: TOKEN
  
  # Respuestas HTTP
  500: Error de Servidor
  404: Recurso no encontrado
  200: OK
```
---
```yaml
  ##  Actualizar usuario por :id
  ##  PATCH /usuarios/:id
  
  # Cabeceras
  x-api-token: TOKEN
  
  # Cuerpo
  matricula:          string(15)
  apPaterno:          string(50)
  apMaterno:          string(50)
  nombre:             string(100)
  correoElectronico:  string(100)
  rol:                enum('profesor', 'estudiante')
  password:           string(150)
  
  # Respuestas HTTP
  500: Error de Servidor
  400: Peticion Mal Formada
  200: Ok
```
---
```yaml
  ##  Eliminar usuario por :id
  ##  DELETE /usuarios/:id
  
  # Cabeceras
  x-api-token: TOKEN
  
  # Respuestas HTTP
  404: Recurso no encontrado
  500: Error de Servidor
  200: Ok
```
---
```yaml
  ##  Enlistar todos los Cursos
  ##  GET /cursos
  
  # Cabeceras
  x-api-token: TOKEN
  
  # Respuestas HTTP
  500: Error de Servidor
  200: Ok
```
---
```yaml
  ##  Obtener un curso por :id
  ##  GET /cursos/:id
  
  # Cabeceras
  x-api-token: TOKEN
  
  # Respuestas HTTP
  400: Peticion Mal Formada
  500: Error de Servidor
  200: Ok
```
---
```yaml
  ##  Crear nuevo Curso
  ##  POST /cursos
  
  # Cabeceras
  x-api-token: TOKEN
  
  # Cuerpo
  curso:
    matricula:  string(15)  requerido
    nombre:     string(255) requerido
    inicio:     date        requerido   YYYY-mm-dd
    fin:        date        requerido   YYYY-mm-dd
  salon:
    id:           idSalon     NOTA: Si envias este parámetro, el resto de los parámetros de salón serán ignorados. 
    codigo:       string(15)  requerido
    edificio:     string(15)  requerido
    facultad:     string(100) requerido
    institucion:  string(100) requerido
  horarios[]:
    dia:        enum<'L','A','M','J','V','S','D'> requerido
    hora:       time  requerido
  
  # Respuestas HTTP
  400: Peticion Mal Formada
  500: Error de Servidor
  201: Creado
```
