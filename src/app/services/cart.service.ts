import { Injectable } from '@angular/core';
import { ProductInCart } from '../model/product-in-cart';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  productsInCart: ProductInCart[] = [];
  totalPrice = new Subject<number>();
  totalQuantity = new Subject<number>();

  constructor() { }

  addToCart(productEntry: ProductInCart): void {
    const cartProduct = this.productsInCart.find(product => product.id === productEntry.id);
    if (cartProduct === undefined) {
      this.productsInCart.push(productEntry);
    } else {
      cartProduct.quantity++;
    }

    this.publishTotals();
  }

  removeOneFromCart(product: ProductInCart): void {
    product.quantity--;
    if (product.quantity === 0) {
      const index = this.productsInCart.findIndex(tempProduct => tempProduct.id === product.id);
      this.productsInCart.splice(index, 1);
    }
    this.publishTotals();
  }

  removeProductFromCart(product: ProductInCart): void {
    const index = this.productsInCart.findIndex(tempProduct => tempProduct.id === product.id);
    this.productsInCart.splice(index, 1);
    this.publishTotals();
  }

  publishTotals(): void {
    let price = 0;
    let quantity = 0;
    for (const product of this.productsInCart) {
      price += product.unitPrice * product.quantity;
      quantity += product.quantity;
    }
    // .next() will publish the values to all subscribers
    this.totalPrice.next(price);
    this.totalQuantity.next(quantity);
  }
}
