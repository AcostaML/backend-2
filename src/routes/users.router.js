import { Router } from 'express';
import passport from 'passport';
import { UserModel } from '../dao/models/user.model.js';
import { createHash } from '../utils/bcrypt.js';
import { authorizeRoles } from '../middlewares/authorization.js';

const router = Router();

// Proteger todas las rutas con JWT y solo admin
router.use(
  passport.authenticate('current', { session: false }),
  authorizeRoles('admin')
);

// GET /api/users -> listar todos
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json({ status: 'success', payload: users });
  } catch (error) {
    console.error('Error GET /api/users:', error);
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
});

// GET /api/users/:uid -> obtener uno
router.get('/:uid', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.uid).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    res.json({ status: 'success', payload: user });
  } catch (error) {
    console.error('Error GET /api/users/:uid:', error);
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
});

// POST /api/users -> crear (versión admin, similar a /register)
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role: role || 'user',
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
    console.error('Error POST /api/users:', error);
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
});

// PUT /api/users/:uid -> actualizar (hash si cambia password)
router.put('/:uid', async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const updateData = { ...rest };

    if (password) {
      updateData.password = createHash(password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.uid,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', payload: updatedUser });
  } catch (error) {
    console.error('Error PUT /api/users/:uid:', error);
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
});

// DELETE /api/users/:uid -> eliminar
router.delete('/:uid', async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.uid);

    if (!deletedUser) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error DELETE /api/users/:uid:', error);
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
});

export default router;
