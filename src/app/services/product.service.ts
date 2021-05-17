import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  // httpClient is injected at runtime. The field is also declared by the constructor.
  constructor(private httpClient: HttpClient) {  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getPaginatedProductList(categoryID: number,
                          pageNumber: number,
                          pageSize: number): Observable<GetResponseProducts> {

    const pageUrl = `${this.productsUrl}/search/findByCategoryId?id=${categoryID}`
      + `&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(pageUrl);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByNameContaining?name=${keyword}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

}

// This interface will assist in unwrapping the json response.
interface GetResponseProducts {
  _embedded: {
    products: Product[],
  };
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[],
  };
}
