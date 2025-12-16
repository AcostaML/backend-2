import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  baseUrl: process.env.BASE_URL
};
