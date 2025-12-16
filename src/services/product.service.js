import { ProductRepository } from '../repositories/product.repository.js';

export class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  getAll() {
    return this.productRepository.getProducts();
  }

  getById(id) {
    return this.productRepository.getProductById(id);
  }

  create(data) {
    return this.productRepository.createProduct(data);
  }

  update(id, data) {
    return this.productRepository.updateProduct(id, data);
  }

  delete(id) {
    return this.productRepository.deleteProduct(id);
  }
}
