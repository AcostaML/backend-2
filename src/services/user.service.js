import { UserRepository } from '../repositories/user.repository.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateResetToken } from '../utils/resetToken.js';
import { transporter } from '../config/mailer.js';
import { config } from '../config/config.js';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
  }

  getUsers() {
    return this.userRepository.getUsers();
  }

  getUserById(id) {
    return this.userRepository.getUserById(id);
  }

  async registerUser(userData) {
    const exists = await this.userRepository.getUserByEmail(userData.email);
    if (exists) {
      throw new Error('El usuario ya existe');
    }

    const cart = await this.cartRepository.createCart();
    userData.cart = cart._id;
    userData.password = createHash(userData.password);
    return this.userRepository.createUser(userData);
  }

  async updateUser(id, data) {
    const { password, ...rest } = data;
    const payload = { ...rest };

    if (password) {
      payload.password = createHash(password);
    }

    const updated = await this.userRepository.updateUser(id, payload);
    if (!updated) {
      throw new Error('Usuario no encontrado');
    }

    return updated;
  }

  async deleteUser(id) {
    const deleted = await this.userRepository.deleteUser(id);
    if (!deleted) {
      throw new Error('Usuario no encontrado');
    }
    return deleted;
  }

  async resetPassword(userId, newPassword) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const samePassword = isValidPassword(newPassword, user.password);
    if (samePassword) {
      throw new Error('No puedes usar la misma contraseña');
    }

    return this.userRepository.updateUser(userId, {
      password: createHash(newPassword),
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    });
  }

  async requestPasswordReset(email) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) return null;

    const token = generateResetToken(user._id);

    await this.userRepository.updateUser(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000
    });

    const resetLink = `${config.baseUrl}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: 'Ecommerce <no-reply@ecommerce.com>',
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Haz click en el botón para restablecer tu contraseña. El enlace expira en 1 hora.</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#1f7aec;color:#fff;text-decoration:none;border-radius:6px;">Restablecer contraseña</a>
      `
    });

    return token;
  }
}
