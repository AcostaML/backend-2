import { Router } from 'express';
import passport from 'passport';

import { UserService } from '../services/user.service.js';
import { UserCurrentDTO } from '../dtos/userCurrent.dto.js';
import { generateToken } from '../utils/jwt.js';

const router = Router();
const userService = new UserService();

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: 'error', message: 'Campos incompletos' });
    }

    const user = await userService.registerUser(req.body);

    res.status(201).json({
      status: 'success',
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
      })
      .json({
        status: 'success',
        message: 'Login exitoso',
        user: new UserCurrentDTO(req.user)
      });
  }
);

router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    const userDTO = new UserCurrentDTO(req.user);
    res.json({ status: 'success', user: userDTO });
  }
);

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    await userService.requestPasswordReset(email);
    res.json({
      status: 'success',
      message: 'Si el email existe, se enviará un correo con el enlace de recuperación'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al enviar el correo' });
  }
});

router.post(
  '/reset-password',
  passport.authenticate('jwt-reset', { session: false }),
  async (req, res) => {
    const { newPassword } = req.body;
    const token = req.query.token;

    if (!token || req.user.resetPasswordToken !== token) {
      return res.status(400).json({ status: 'error', message: 'Token inválido' });
    }

    if (!req.user.resetPasswordExpires || req.user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ status: 'error', message: 'Token expirado' });
    }

    try {
      await userService.resetPassword(req.user._id, newPassword);
      res.json({ status: 'success', message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
);

export default router;
