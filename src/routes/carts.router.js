import { Router } from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorization.js';
import { CartService } from '../services/cart.service.js';

const router = Router();
const cartService = new CartService();

router.post('/', async (_req, res) => {
  try {
    const cart = await cartService.createCart();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post(
  '/:cid/products/:pid',
  passport.authenticate('current', { session: false }),
  authorizeRoles('user', 'premium'),
  async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = Number(req.body.quantity) || 1;

    if (req.user.cart?.toString() !== cid.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Solo puedes modificar tu propio carrito'
      });
    }

    try {
      const cart = await cartService.addProduct(cid, pid, quantity);
      res.json({ status: 'success', payload: cart });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
);

router.post(
  '/:cid/purchase',
  passport.authenticate('current', { session: false }),
  authorizeRoles('user', 'premium'),
  async (req, res) => {
    const { cid } = req.params;

    if (req.user.cart?.toString() !== cid.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Solo puedes comprar con tu propio carrito'
      });
    }

    try {
      const result = await cartService.purchase(cid, req.user.email);
      res.json({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
);

export default router;
