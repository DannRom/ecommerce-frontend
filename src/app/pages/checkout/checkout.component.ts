import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductInCart } from '../../model/product-in-cart';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order, OrderItem, Transaction } from './checkout.entity';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


const BILLING_ADDRESS = 'billingAddress';
const SHIPPING_ADDRESS = 'shippingAddress';
const CUSTOMER = 'customer';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  dropdownMonths: number[] = Array.from(new Array(12), (_, i) => i + 1);
  dropdownYears: number[] = Array.from(new Array(10), (_, i) => i + new Date().getFullYear());

  productsInCart: ProductInCart[] = [];
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.defineCheckoutFormGroup();

    this.productsInCart = this.cartService.productsInCart;

    this.cartService.totalQuantity.subscribe(
      quantity => this.totalQuantity = quantity
    );

    this.cartService.totalPrice.subscribe(
      price => this.totalPrice = price
    );

    this.cartService.publishTotals();
  }

  defineCheckoutFormGroup(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required])
      }),
    });
  }

  get firstName(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(): AbstractControl | null {
    return this.checkoutFormGroup.get('customer.email');
  }

  get billingStreet(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingCity(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingState(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingCountry(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingZipcode(): AbstractControl | null {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get shippingStreet(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingCity(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingState(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingCountry(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingZipcode(): AbstractControl | null {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  copyBillingAddressToShippingAddress(): void {
    const element = document.getElementById('customCheck') as HTMLInputElement;
    if (element.checked) {
      this.checkoutFormGroup.controls.shippingAddress
        .setValue(this.checkoutFormGroup.controls.billingAddress.value);

      console.log('billingAddress');
      console.log(this.checkoutFormGroup.get('billingAddress')?.value);
      console.log('shippingAddress');
      console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    } else {
      this.checkoutFormGroup.controls.shippingAddress.reset();
    }
  }

  completeCheckout(): void {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    console.log('handling submission');
    console.log(this.checkoutFormGroup.value);
    console.log('The email address is ' + this.checkoutFormGroup.get('customer')?.value.email);

    const transaction = new Transaction();
    transaction.customer = this.checkoutFormGroup.controls[CUSTOMER].value;

    transaction.billingAddress = this.checkoutFormGroup.controls[BILLING_ADDRESS].value;
    transaction.billingAddress.state = JSON.parse(JSON.stringify(transaction.billingAddress.state));
    transaction.billingAddress.country = JSON.parse(JSON.stringify(transaction.billingAddress.country));

    transaction.shippingAddress = this.checkoutFormGroup.controls[SHIPPING_ADDRESS].value;
    transaction.shippingAddress.state = JSON.parse(JSON.stringify(transaction.shippingAddress.state));
    transaction.shippingAddress.country = JSON.parse(JSON.stringify(transaction.shippingAddress.country));

    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    transaction.order = order;

    const productsInCart = this.cartService.productsInCart;
    transaction.orderItems = productsInCart.map(item => new OrderItem(item));

    this.checkoutService.placeOrder(transaction).subscribe({
      next: response => {
        alert(`Your order has been received.\nTracking Number:  ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: error => {
        alert(`An error occurred: ${error.message}`);
      }
    });
  }

  private resetCart(): void {
    this.cartService.productsInCart = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products').then(r => r); // empty response for navigateByUrl promise.
  }
}
