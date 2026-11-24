# Descuentos API

API REST para registrar y consultar descuentos ofrecidos por proveedores locales, con datos de contacto y municipio. Construida con **Node.js, Express y MongoDB Atlas**.

## Características

- CRUD completo de descuentos
- Filtros por municipio, búsqueda por nombre y paginación
- Validación de datos con mensajes claros en español
- Manejo centralizado de errores y respuestas con formato uniforme
- Seguridad básica: `helmet`, CORS configurable, límite de peticiones y tamaño de body
- Endpoint `/health` para monitoreo
- Cierre ordenado del servidor (SIGINT/SIGTERM)

## Requisitos

- Node.js 18 o superior
- Una base de datos en [MongoDB Atlas](https://www.mongodb.com/atlas) (o MongoDB local)

## Instalación

```bash
git clone <url-del-repositorio>
cd descuentos-api
npm install
cp .env.example .env
```

Edite `.env` con sus valores:

| Variable | Descripción | Por defecto |
|---|---|---|
| `MONGO_URI` | Cadena de conexión de MongoDB (**obligatoria**) | — |
| `PORT` | Puerto del servidor | `3000` |
| `CORS_ORIGIN` | Orígenes permitidos, separados por coma | `*` |
| `NODE_ENV` | `development` o `production` | `development` |

## Ejecución

```bash
npm run dev     # desarrollo, con recarga automática
npm start       # producción
```

## Estructura del proyecto

```
src/
├── config/        # variables de entorno y conexión a la base de datos
├── models/        # esquemas de Mongoose
├── controllers/   # lógica de cada endpoint
├── routes/        # definición de rutas
├── middlewares/   # validación de id y manejo de errores
├── utils/         # utilidades (ErrorHttp, asyncHandler)
├── app.js         # configuración de Express
└── server.js      # arranque del servidor
```

## Modelo `Descuento`

| Campo | Tipo | Reglas |
|---|---|---|
| `nombre` | String | Obligatorio, 3 a 120 caracteres |
| `precio` | Number | Obligatorio, mayor o igual a 0 |
| `municipio` | String | Obligatorio |
| `nombre_contacto` | String | Obligatorio |
| `celular` | String | Obligatorio, 10 dígitos y empieza por 3 |

Cada documento incluye además `id`, `createdAt` y `updatedAt`.

## Endpoints

Base: `/api/descuentos`

| Método | Ruta | Descripción | Código exitoso |
|---|---|---|---|
| GET | `/` | Lista descuentos (filtros y paginación) | 200 |
| GET | `/:id` | Obtiene un descuento | 200 |
| POST | `/` | Crea un descuento | 201 |
| PUT | `/:id` | Actualiza un descuento (campos parciales permitidos) | 200 |
| DELETE | `/:id` | Elimina un descuento | 200 |
| GET | `/health` | Estado del servicio y la base de datos | 200 |

### Parámetros de consulta (GET `/`)

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `municipio` | Filtra por municipio exacto (sin distinguir mayúsculas) | `?municipio=Medellín` |
| `buscar` | Busca coincidencias en el nombre | `?buscar=pizza` |
| `page` | Página (por defecto 1) | `?page=2` |
| `limit` | Resultados por página (1 a 100, por defecto 10) | `?limit=20` |

## Ejemplos

**Crear un descuento**

```bash
curl -X POST http://localhost:3000/api/descuentos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "2x1 en pizzas medianas",
    "precio": 25000,
    "municipio": "Medellín",
    "nombre_contacto": "Laura Gómez",
    "celular": "3001234567"
  }'
```

Respuesta `201`:

```json
{
  "ok": true,
  "mensaje": "Descuento creado exitosamente",
  "data": {
    "nombre": "2x1 en pizzas medianas",
    "precio": 25000,
    "municipio": "Medellín",
    "nombre_contacto": "Laura Gómez",
    "celular": "3001234567",
    "createdAt": "2026-11-24T15:00:00.000Z",
    "updatedAt": "2026-11-24T15:00:00.000Z",
    "id": "6743a1f2c8b9d4e5f6a7b8c9"
  }
}
```

**Listar con filtros**

```bash
curl "http://localhost:3000/api/descuentos?municipio=Medellín&page=1&limit=5"
```

```json
{
  "ok": true,
  "data": [ ... ],
  "paginacion": { "pagina": 1, "limite": 5, "total": 12, "totalPaginas": 3 }
}
```

**Actualizar**

```bash
curl -X PUT http://localhost:3000/api/descuentos/6743a1f2c8b9d4e5f6a7b8c9 \
  -H "Content-Type: application/json" \
  -d '{ "precio": 22000 }'
```

**Eliminar**

```bash
curl -X DELETE http://localhost:3000/api/descuentos/6743a1f2c8b9d4e5f6a7b8c9
```

## Manejo de errores

Todas las respuestas de error usan el mismo formato:

```json
{
  "ok": false,
  "mensaje": "Datos inválidos",
  "errores": [
    { "campo": "celular", "mensaje": "El celular debe tener 10 dígitos y empezar por 3" }
  ]
}
```

| Código | Causa |
|---|---|
| 400 | Datos inválidos, id mal formado o JSON incorrecto |
| 404 | Descuento o ruta no encontrados |
| 429 | Demasiadas peticiones (límite: 200 cada 15 minutos) |
| 500 | Error interno del servidor |

## Despliegue

1. Configure las variables de entorno en la plataforma (Render, Railway, etc.). No suba el archivo `.env`.
2. Use `NODE_ENV=production` y defina `CORS_ORIGIN` con el dominio de su frontend.
3. En MongoDB Atlas, agregue la IP del servidor en *Network Access*.
4. Comando de inicio: `npm start`.

## Licencia

MIT
