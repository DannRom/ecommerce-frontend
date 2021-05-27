import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice = 0; // todo add total price to page.
  totalQuantity = 0; // todo add total quantity to page
  dropdownMonths!: number[];
  dropdownYears!: number[];

  constructor(private formBuilder: FormBuilder,
              private formService: FormService) {
  }

  ngOnInit(): void {
    this.defineCheckoutFormGroup();

    this.formService.getDropdownMonths().subscribe(
      data => this.dropdownMonths = data
    );

    this.formService.getDropdownYears().subscribe(
      data => this.dropdownYears = data
    );
  }

  defineCheckoutFormGroup(): void {
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
