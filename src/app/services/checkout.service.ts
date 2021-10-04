import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../pages/checkout/checkout.entity';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = 'http://localhost:8080/api/checkout/transaction';

  constructor(private httpClient: HttpClient) { }

  placeOrder(transaction: Transaction): Observable<any> {
    return this.httpClient.post<Transaction>(this.purchaseUrl, transaction);
  }
}
