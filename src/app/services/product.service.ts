import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  // Runtime injection creates the field via constructor at runtime.
  // httpClient is injected at runtime.
  constructor(private httpClient: HttpClient) {  }

  getProductList(): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    );
  }
  // The json response will be of type GetResponse and will contain
  // a field/key called _embedded. The contents of _embedded
  // will be stored within an array of type Product[].

}

// This interface will assist in unwrapping the json response.
interface GetResponse {
  _embedded: {
    products: Product[];
  };
}
