import { Router } from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorization.js';
import { UserService } from '../services/user.service.js';

const router = Router();
const userService = new UserService();

router.use(
  passport.authenticate('current', { session: false }),
  authorizeRoles('admin')
);

router.get('/', async (_req, res) => {
  try {
    const users = await userService.getUsers();
    const safeUsers = users.map((user) => ({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart
    }));
    res.json({ status: 'success', payload: safeUsers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
});

router.get('/:uid', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.uid);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    res.json({
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
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
});

router.post('/', async (req, res) => {
  try {
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

router.put('/:uid', async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.uid, req.body);
    res.json({
      status: 'success',
      payload: {
        id: updatedUser._id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        age: updatedUser.age,
        role: updatedUser.role,
        cart: updatedUser.cart
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.delete('/:uid', async (req, res) => {
  try {
    await userService.deleteUser(req.params.uid);
    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
