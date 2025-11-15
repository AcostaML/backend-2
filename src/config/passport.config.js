import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { UserModel } from '../dao/models/user.model.js';
import { isValidPassword } from '../utils/bcrypt.js';

const LocalStrategy = local.Strategy;
const JWTStrategy   = jwt.Strategy;
const ExtractJWT    = jwt.ExtractJwt;

const JWT_SECRET = process.env.JWT_SECRET || 'coderSecretJWT';

export const initPassport = () => {
  // Estrategia para login (email + password)
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
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

  // Estrategia "current" para validar JWT
  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          // Puedes confiar en el payload o volver a buscar al user en la DB
          const userId = jwtPayload.user?.id;
          if (!userId) return done(null, false);

          const user = await UserModel.findById(userId);
          if (!user) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
