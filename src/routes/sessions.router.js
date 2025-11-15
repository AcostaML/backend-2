import { Router } from 'express';
import passport from 'passport';
import { UserModel } from '../dao/models/user.model.js';
import { createHash } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';

const router = Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: 'error', message: 'Campos incompletos' });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
    }

    const hashedPassword = createHash(password);

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: 'user',
    });

    res.status(201).json({
      status: 'success',
      payload: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error en /register:', error);
    res.status(500).json({ status: 'error', message: 'Error interno en registro' });
  }
});

// Login + generación de JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: info?.message || 'Credenciales inválidas' });
    }

    const token = generateToken(user);

    return res.json({
      status: 'success',
      token,
    });
  })(req, res, next);
});

// /api/sessions/current -> valida token y devuelve datos del usuario
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    // Si llegamos aquí, el token es válido y req.user existe
    const user = req.user;

    res.json({
      status: 'success',
      user: {
        id:         user._id,
        first_name: user.first_name,
        last_name:  user.last_name,
        email:      user.email,
        age:        user.age,
        role:       user.role,
        cart:       user.cart,
      },
    });
  }
);

export default router;
