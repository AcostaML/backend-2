import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';

import { UserModel } from '../dao/models/user.model.js';
import { isValidPassword } from '../utils/bcrypt.js';
import { config } from './config.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  if (req && req.cookies) return req.cookies.jwt;
  return null;
};

/**
 * Inicialización de Passport
 */
export const initPassport = () => {
  /**
   * =========================
   * LOGIN (Local Strategy)
   * =========================
   * Autenticación por email y password
   * Usa sesión (cookies)
   */
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: true
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
          }

          const validPassword = isValidPassword(password, user.password);
          if (!validPassword) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          cookieExtractor,
          ExtractJWT.fromAuthHeaderAsBearerToken()
        ]),
        secretOrKey: config.jwtSecret
      },
      async (payload, done) => {
        try {
          const user = await UserModel.findById(payload.user.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  /**
   * =========================
   * SERIALIZE / DESERIALIZE
   * =========================
   * Necesario para sesiones
   */
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  /**
   * =========================
   * JWT (SOLO para reset password)
   * =========================
   * No se usa para current
   */
  passport.use(
    'jwt-reset',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token'),
        secretOrKey: config.jwtSecret
      },
      async (payload, done) => {
        try {
          const user = await UserModel.findById(payload.userId);
          if (!user) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
