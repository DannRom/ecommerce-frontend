import { ProductInCart } from './product-in-cart';

export class OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;


  constructor(productInCart: ProductInCart) {
    this.productId = productInCart.id;
    this.quantity = productInCart.quantity;
    this.unitPrice = productInCart.unitPrice;
    this.imageUrl = productInCart.imageUrl;
  }
}
