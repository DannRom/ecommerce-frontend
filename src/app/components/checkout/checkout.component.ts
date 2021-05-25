import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice = 0;
  totalQuantity = 0;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: ['']
      }),
      paymentInfo: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        expirationMonth: [''],
        expirationYear: [''],
        securityCode: ['']
      })
    });
  }

  copyBillingAddressToShippingAddress(): void {
    const element = document.getElementById('customCheck') as HTMLInputElement;
    if (element.checked) {
      this.checkoutFormGroup.controls.shippingAddress
        .setValue(this.checkoutFormGroup.controls.billingAddress.value);
      console.log('Toggled On');
    } else {
      this.checkoutFormGroup.controls.shippingAddress.reset();
      console.log('Off');
    }
  }

  completeCheckout(): void {
    console.log('handling submission');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log('The email address is ' + this.checkoutFormGroup.get('customer')?.value.email);
  }
}
