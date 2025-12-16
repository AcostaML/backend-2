# Ecommerce Backend - Entrega Final

Servidor Express con arquitectura en capas (DAO + Repository + Services), autenticación con Passport JWT y recuperación de contraseña con mailing. Incluye roles (`admin`, `user`, `premium`), autorización por endpoint, carritos, productos y tickets de compra con verificación de stock.

## Configuración
- Node 18+
- Instalar dependencias: `npm install`
- Variables de entorno (.env):
```
PORT=8080
MONGO_URI=<cadena mongodb>
SESSION_SECRET=<clave_sesion>
COOKIE_SECRET=<clave_cookie>
JWT_SECRET=<clave_jwt>
MAIL_USER=<usuario_gmail_app_password>
MAIL_PASS=<app_password>
BASE_URL=http://localhost:8080
```

## Scripts
- `npm start` inicia el servidor (usa .env).

## Rutas principales
- Auth:
  - `POST /api/sessions/register` registra usuario (crea carrito asociado).
  - `POST /api/sessions/login` login local, emite JWT en cookie `jwt`.
  - `GET /api/sessions/current` requiere JWT, devuelve `UserCurrentDTO` sin datos sensibles.
  - `POST /api/sessions/forgot-password` envía mail con link válido 1h.
  - `POST /api/sessions/reset-password?token=...` con `newPassword`; valida token, expira 1h y evita reutilizar contraseña.
- Usuarios (solo admin, JWT current):
  - `GET/POST /api/users`, `GET/PUT/DELETE /api/users/:uid`
- Productos (solo admin para CUD):
  - `GET /api/products`
  - `POST/PUT/DELETE /api/products/:pid` (admin)
- Carritos:
  - `POST /api/carts` crea carrito.
  - `POST /api/carts/:cid/products/:pid` (user|premium) agrega al propio carrito.
  - `POST /api/carts/:cid/purchase` (user|premium) procesa compra, descuenta stock, genera ticket y devuelve faltantes.

## Notas de arquitectura
- DAO en `src/dao/mongo`, repositorios en `src/repositories`, lógica de negocio en `src/services`.
- Autorización por rol en `src/middlewares/authorization.js`; estrategia `current` en `src/config/passport.config.js` extrae JWT de cookie/bearer.
- DTO `UserCurrentDTO` evita exponer campos sensibles.

## Pruebas rápidas sugeridas
1) Register -> Login -> Current (debe devolver DTO sin password).
2) Forgot/Reset password: probar enlace antes y después de 1h (mockeable acortando expiración).
3) CRUD productos con admin y bloqueo para user.
4) Carrito: agregar productos como user/premium, ejecutar purchase y validar ticket + faltantes y stock.
