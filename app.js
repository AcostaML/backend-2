import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import { initPassport } from './src/config/passport.config.js';
import sessionsRouter from './src/routes/sessions.router.js';
import usersRouter from './src/routes/users.router.js';
// importa tus routers más abajo

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initPassport();
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 8080;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-acosta';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
  }
};

startServer();

export default app;
