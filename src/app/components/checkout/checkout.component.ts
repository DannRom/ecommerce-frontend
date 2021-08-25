import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { CartService } from '../../services/cart.service';
import { ProductInCart } from '../../common/product-in-cart';

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
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.defineCheckoutFormGroup();

    this.formService.getDropdownMonths().subscribe(
      data => this.dropdownMonths = data
    );

    this.formService.getDropdownYears().subscribe(
      data => this.dropdownYears = data
    );

    this.productsInCart = this.cartService.productsInCart;

    this.cartService.totalQuantity.subscribe(
       data => this.totalQuantity = data
    );

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
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
        zipcode: new FormControl('', [Validators.required])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipcode: new FormControl('', [Validators.required])
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

  get firstName(): AbstractControl | null { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(): AbstractControl | null { return this.checkoutFormGroup.get('customer.lastName'); }
  get email(): AbstractControl | null { return this.checkoutFormGroup.get('customer.email'); }

  get billingStreet(): AbstractControl | null { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity(): AbstractControl | null { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState(): AbstractControl | null { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry(): AbstractControl | null { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingZipcode(): AbstractControl | null { return this.checkoutFormGroup.get('billingAddress.zipcode'); }

  get shippingStreet(): AbstractControl | null { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity(): AbstractControl | null { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState(): AbstractControl | null { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry(): AbstractControl | null { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingZipcode(): AbstractControl | null { return this.checkoutFormGroup.get('shippingAddress.zipcode'); }

  get cardType(): AbstractControl | null { return this.checkoutFormGroup.get('paymentInfo.cardType'); }
  get nameOnCard(): AbstractControl | null { return this.checkoutFormGroup.get('paymentInfo.nameOnCard'); }
  get cardNumber(): AbstractControl | null { return this.checkoutFormGroup.get('paymentInfo.cardNumber'); }
  get expirationMonth(): AbstractControl | null { return this.checkoutFormGroup.get('paymentInfo.expirationMonth'); }
  get expirationYear(): AbstractControl | null { return this.checkoutFormGroup.get('paymentInfo.expirationYear'); }
  get securityCode(): AbstractControl | null { return this.checkoutFormGroup.get('paymentInfo.securityCode'); }


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
    }
    console.log('handling submission');
    console.log(this.checkoutFormGroup.value);
    console.log('The email address is ' + this.checkoutFormGroup.get('customer')?.value.email);
  }

}
