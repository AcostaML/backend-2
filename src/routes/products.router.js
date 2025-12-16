import { Router } from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorization.js';
import { ProductService } from '../services/product.service.js';

const router = Router();
const productService = new ProductService();

router.get('/', async (_req, res) => {
  try {
    const products = await productService.getAll();
    res.json({ status: 'success', payload: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post(
  '/',
  passport.authenticate('current', { session: false }),
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
);

router.put(
  '/:pid',
  passport.authenticate('current', { session: false }),
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const updated = await productService.update(req.params.pid, req.body);
      if (!updated) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
      res.json({ status: 'success', payload: updated });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
);

router.delete(
  '/:pid',
  passport.authenticate('current', { session: false }),
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const deleted = await productService.delete(req.params.pid);
      if (!deleted) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
      res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
);

export default router;
