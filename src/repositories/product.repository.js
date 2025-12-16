import { ProductDAO } from '../dao/mongo/product.dao.js';

export class ProductRepository {
  constructor() {
    this.dao = new ProductDAO();
  }

  getProducts() {
    return this.dao.getAll();
  }

  getProductById(id) {
    return this.dao.getById(id);
  }

  createProduct(data) {
    return this.dao.create(data);
  }

  updateProduct(id, data) {
    return this.dao.update(id, data);
  }

  deleteProduct(id) {
    return this.dao.delete(id);
  }
}
