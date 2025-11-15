# Backend 2 - Ecommerce: Usuarios, Autenticación y JWT

Proyecto del curso **Diseño y Arquitectura Backend** basado en un ecommerce, donde se implementa:

- CRUD de usuarios
- Autenticación con **Passport + JWT**
- Autorización por roles (`user`, `admin`)
- Endpoint `/current` para obtener el usuario logueado a partir del token JWT

---

## 🛠 Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- Passport
  - `passport-local`
  - `passport-jwt`
- bcrypt
- JSON Web Tokens (JWT)

---

## 📁 Estructura general (simplificada)

```txt
app.js
src/
  config/
    passport.config.js
  dao/
    models/
      user.model.js
  routes/
    sessions.router.js
    users.router.js
  middlewares/
    authorization.js
  utils/
    bcrypt.js
    jwt.js
