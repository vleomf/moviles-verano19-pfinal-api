# Proyecto Final (API)

URIs REST
<hr/>

### Usuarios

```json
GET /usuarios/
```

```json
GET /usuarios/{id}
```

```json
POST /usuarios/
{
    "matricula": "requerido",
    "apPaterno": "requerido",
    "apMaterno": "requerido",
    "nombre": "requerido",
    "correoElectronico": "requerido",
    "fotografia": "opcional",
    "rol": "requerido < estudiante | profesor >",
    "password": "opcional"
}
```

```json
PATH /usuarios/{id}
```

```json
DELETE /usuarios/{id}
```
