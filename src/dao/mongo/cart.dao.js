import { CartModel } from '../models/cart.model.js';

export class CartDAO {
  create = () => CartModel.create({ products: [] });

  getById = (id) => CartModel.findById(id);

  update = (id, data) => CartModel.findByIdAndUpdate(id, data, { new: true });
}
