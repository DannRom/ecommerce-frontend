import { Component, OnInit } from '@angular/core';
import { ProductInCart } from '../../model/product-in-cart';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {

  productsInCart: ProductInCart[] = [];
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listProductsInCart();
  }

  private listProductsInCart(): void {
    this.productsInCart = this.cartService.productsInCart;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    this.cartService.publishTotals();
  }

  addToCart(product: ProductInCart): void {
    this.cartService.addToCart(product);
  }

  removeOneFromCart(product: ProductInCart): void {
    this.cartService.removeOneFromCart(product);
  }

  removeProductFromCart(product: ProductInCart): void {
    this.cartService.removeProductFromCart(product);
  }
}
