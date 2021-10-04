import { ProductInCart } from '../../model/product-in-cart';

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

export class Order {
  totalQuantity!: number;
  totalPrice!: number;
}

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

export class Transaction {
  customer!: Customer;
  billingAddress!: Address;
  shippingAddress!: Address;
  order!: Order;
  orderItems!: OrderItem[];
}

