import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';

const generateTicketCode = () => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

export class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
    this.ticketRepository = new TicketRepository();
  }

  createCart() {
    return this.cartRepository.createCart();
  }

  async getCart(cartId) {
    const cart = await this.cartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await this.getCart(cartId);
    const product = await this.productRepository.getProductById(productId);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (quantity <= 0) {
      throw new Error('Cantidad inválida');
    }

    const existing = cart.products.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return this.cartRepository.updateCart(cartId, { products: cart.products });
  }

  async purchase(cartId, purchaserEmail) {
    const cart = await this.getCart(cartId);

    const purchasable = [];
    const unavailable = [];
    let amount = 0;

    for (const item of cart.products) {
      const productId = item.product._id ? item.product._id : item.product;
      const product = await this.productRepository.getProductById(productId);
      if (!product) {
        unavailable.push(productId.toString());
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await this.productRepository.updateProduct(product._id, { stock: product.stock });
        amount += product.price * item.quantity;
        purchasable.push(item);
      } else {
        unavailable.push(productId.toString());
      }
    }

    const remaining = cart.products.filter((item) =>
      unavailable.includes(item.product.toString())
    );
    await this.cartRepository.updateCart(cartId, { products: remaining });

    let ticket = null;
    if (purchasable.length > 0) {
      ticket = await this.ticketRepository.createTicket({
        code: generateTicketCode(),
        amount,
        purchaser: purchaserEmail
      });
    }

    return {
      ticket,
      unavailable
    };
  }
}
