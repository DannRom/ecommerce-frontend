import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { CartService } from '../../services/cart.service';
import { ProductInCart } from '../../model/product-in-cart';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order, OrderItem, Purchase } from './checkout.entity';

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
  dropdownMonths!: number[];
  dropdownYears!: number[];

  productsInCart: ProductInCart[] = [];
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.defineCheckoutFormGroup();

    this.formService.getDropdownMonths().subscribe(
      months => this.dropdownMonths = months
    );

    this.formService.getDropdownYears().subscribe(
      years => this.dropdownYears = years
    );

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
      paymentInfo: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required]),
        cardNumber: new FormControl('', [Validators.required]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
        securityCode: new FormControl('', [Validators.required])
      })
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

  get cardType(): AbstractControl | null {
    return this.checkoutFormGroup.get('paymentInfo.cardType');
  }

  get nameOnCard(): AbstractControl | null {
    return this.checkoutFormGroup.get('paymentInfo.nameOnCard');
  }

  get cardNumber(): AbstractControl | null {
    return this.checkoutFormGroup.get('paymentInfo.cardNumber');
  }

  get expirationMonth(): AbstractControl | null {
    return this.checkoutFormGroup.get('paymentInfo.expirationMonth');
  }

  get expirationYear(): AbstractControl | null {
    return this.checkoutFormGroup.get('paymentInfo.expirationYear');
  }

  get securityCode(): AbstractControl | null {
    return this.checkoutFormGroup.get('paymentInfo.securityCode');
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

    const purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls[CUSTOMER].value;

    purchase.billingAddress = this.checkoutFormGroup.controls[BILLING_ADDRESS].value;
    purchase.billingAddress.state = JSON.parse(JSON.stringify(purchase.billingAddress.state)); // Errors can start at this line
    purchase.billingAddress.country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.shippingAddress = this.checkoutFormGroup.controls[SHIPPING_ADDRESS].value;
    purchase.shippingAddress.state = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    const order = new Order(); // if not const, then use let
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    purchase.order = order;

    const productsInCart = this.cartService.productsInCart;
    purchase.orderItems = productsInCart.map(item => new OrderItem(item));

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => { // If successful
        alert(`Your order has been received.\nTracking Number:  ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: error => { // If failure
        alert(`An error occurred: ${error.message}`);
      }
    });
  }

  private resetCart(): void {
    this.cartService.productsInCart = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }
}
