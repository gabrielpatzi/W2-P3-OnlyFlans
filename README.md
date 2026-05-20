# OnlyFlans – Backend API

Plataforma para apoyar creadores. Los seguidores compran "flanes" (donaciones simbólicas) para apoyar a sus creadores favoritos.

## Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express 5
- **ORM**: Sequelize 6
- **Base de datos**: PostgreSQL
- **Auth**: JWT (jsonwebtoken)
- **Uploads**: Multer
- **Validación**: Joi

## Configuración

```bash
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev
```

### Variables de entorno

```
APP_PORT=3000
DB_URL=postgres://usuario:password@localhost:5432/onlyflans
SECRET_KEY=mi_clave_secreta
FLAN_PRICE=10
```

## Estructura del proyecto

```
onlyflans/
├── index.js                    # Entry point
├── config/
│   ├── db.config.js            # Conexión Sequelize
│   └── multer.config.js        # Config de uploads
├── models/
│   ├── index.js                # Relaciones entre modelos
│   ├── user.model.js           # Usuarios (creador/seguidor)
│   ├── creatorProfile.model.js # Perfil público del creador
│   ├── goal.model.js           # Metas de apoyo
│   ├── post.model.js           # Publicaciones
│   ├── comment.model.js        # Comentarios en posts
│   ├── donation.model.js       # Flanes / donaciones
│   └── favorite.model.js       # Creadores favoritos
├── services/
│   ├── auth.service.js
│   ├── creator.service.js
│   └── follower.service.js
├── controllers/
│   ├── auth.controller.js
│   ├── creator.controller.js
│   └── follower.controller.js
├── routes/
│   ├── auth.route.js
│   ├── creator.route.js
│   └── follower.route.js
├── middlewares/
│   ├── authMiddleware.js       # Verifica JWT
│   ├── roleMiddleware.js       # requireRole('creador'|'seguidor')
│   ├── verifyDonor.js          # Verifica que el seguidor haya donado
│   ├── validateSchema.js       # Valida body con Joi
│   ├── validateParams.js       # Valida params con Joi
│   └── jsonRequestValid.js     # Verifica Content-Type
├── validators/
│   ├── user.schema.js
│   ├── creator.schema.js
│   ├── post.schema.js
│   └── donation.schema.js
└── utils/
    └── jwt.utils.js
```

---

## Endpoints de la API

### Auth — `/auth`

| Método | Ruta        | Descripción                    | Auth |
|--------|-------------|--------------------------------|------|
| POST   | /register   | Registro de usuario            | No   |
| POST   | /login      | Inicio de sesión               | No   |
| POST   | /logout     | Cierre de sesión               | Sí   |

**Body registro:**
```json
{
  "name": "Juan",
  "email": "juan@email.com",
  "password": "123456",
  "role": "creador"
}
```

---

### Creadores — `/creators`

> Las rutas `/me/*` son exclusivas para usuarios con `role: creador`.

| Método | Ruta                    | Descripción                              | Role     |
|--------|-------------------------|------------------------------------------|----------|
| GET    | /search?q=nombre        | Buscar creadores por nombre              | cualquiera |
| GET    | /:creatorId/public      | Ver perfil público (foto, banner, metas) | cualquiera |
| GET    | /me/profile             | Ver mi perfil completo                   | creador  |
| PUT    | /me/profile             | Actualizar bio / precio flan             | creador  |
| POST   | /me/profile/photo       | Subir foto de perfil (multipart)         | creador  |
| POST   | /me/profile/banner      | Subir banner (multipart)                 | creador  |
| GET    | /me/goals               | Ver mis metas                            | creador  |
| POST   | /me/goals               | Crear meta                               | creador  |
| DELETE | /me/goals/:goalId       | Eliminar meta                            | creador  |
| GET    | /me/page                | Ver mis posts con comentarios            | creador  |
| POST   | /me/posts               | Publicar post (multipart, imagen opcional)| creador |
| DELETE | /me/posts/:postId       | Eliminar post                            | creador  |
| GET    | /me/income?startDate=&endDate= | Reporte de ingresos en flanes   | creador  |

---

### Seguidores — `/followers`

> Todas las rutas son exclusivas para usuarios con `role: seguidor`.

| Método | Ruta                                        | Descripción                                | Donación previa |
|--------|---------------------------------------------|--------------------------------------------|-----------------|
| POST   | /creators/:creatorId/donate                 | Enviar flanes a un creador                 | No              |
| GET    | /creators/:creatorId/posts                  | Ver publicaciones del creador              | Sí ✓            |
| POST   | /creators/:creatorId/posts/:postId/comments | Comentar en un post                        | Sí ✓            |
| GET    | /favorites                                  | Ver mis creadores favoritos                | No              |
| POST   | /favorites/:creatorId                       | Agregar creador a favoritos                | No              |
| DELETE | /favorites/:creatorId                       | Quitar creador de favoritos                | No              |
| GET    | /feed                                       | Feed de posts de creadores seguidos        | No              |
| GET    | /donations/history?startDate=&endDate=&creatorName= | Historial de mis donaciones   | No              |

**Body donación:**
```json
{
  "flanCount": 3,
  "message": "Sigue adelante!"
}
```

---

## Reglas de negocio

1. Un usuario se registra como **creador** o **seguidor** (no puede cambiar de rol).
2. Los creadores **no pueden** acceder a rutas de seguidores y viceversa.
3. Un seguidor debe haber **donado al menos 1 flan** a un creador para ver sus publicaciones y comentarlas.
4. Los comentarios en los posts **solo los ve el creador** (en su `/me/page`).
5. Un creador se agrega **automáticamente** a su propio perfil al registrarse.
6. El precio del flan se guarda en cada donación para mantener el histórico correcto.
7. El feed muestra posts de **todos los creadores a los que el seguidor ha donado**.
