# Proyecto Final (API)

---
  > Registrar nuevo usuario ***No requiere TOKEN***
  **POST /registrar**
  ```yaml
    matricula:         string(15)  requerido
    apPaterno:         string(50)  requerido
    apMaterno:         string(50)  requerido
    nombre:            string(100) requerido
    correoElectronico: string(100) requerido
  ```
  **Respuestas HTTP**
  ```yaml
    400: Bad Request (JSON mal formado)
    500: Error de Servidor
    409: Conflicto (Usuario ya existe)
    201: Creado
  ```
---
