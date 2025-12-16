import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { config } from './src/config/config.js';
import { initPassport } from './src/config/passport.config.js';

import sessionsRouter from './src/routes/sessions.router.js';
import usersRouter from './src/routes/users.router.js';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(config.cookieSecret));
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conectado a MongoDB');

    app.listen(config.port, () => {
      console.log(`Servidor escuchando en puerto ${config.port}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
  }
};

startServer();

export default app;
