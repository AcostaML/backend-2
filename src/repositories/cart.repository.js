import { CartDAO } from '../dao/mongo/cart.dao.js';

export class CartRepository {
  constructor() {
    this.dao = new CartDAO();
  }

  createCart() {
    return this.dao.create();
  }

  getCartById(id) {
    return this.dao.getById(id);
  }

  updateCart(id, data) {
    return this.dao.update(id, data);
  }
}
