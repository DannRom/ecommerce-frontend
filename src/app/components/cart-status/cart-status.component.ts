import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice = 0.00;
  totalQuantity = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus(): void {
    this.cartService.totalPrice.subscribe(
      price => this.totalPrice = price
    );
    this.cartService.totalQuantity.subscribe(
      quantity => this.totalQuantity = quantity
    );
  }
}
