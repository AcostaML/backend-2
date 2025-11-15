import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'coderSecretJWT';
const JWT_EXPIRES_IN = '24h';

export const generateToken = (user) => {
  const payload = {
    user: {
      id:         user._id,
      first_name: user.first_name,
      last_name:  user.last_name,
      email:      user.email,
      age:        user.age,
      role:       user.role,
      cart:       user.cart,
    },
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
