import { UserService } from '../services/user.service.js';
import { UserCurrentDTO } from '../dtos/userCurrent.dto.js';

const userService = new UserService();

export const getCurrentUser = (req, res) => {
  const userDTO = new UserCurrentDTO(req.user);
  res.json({ status: 'success', user: userDTO });
};

export const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ status: 'success', user });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
