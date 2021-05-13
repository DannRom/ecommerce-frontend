import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] | undefined;
  currentCategoryId: number | undefined;
  searchMode: boolean | undefined;

  // Inject ProductService
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  // Subscribe will execute in an asynchronous fashion.
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  private listProducts(): void {
    // check if the key word is there
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(): void {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword') as string;
    this.productService.searchProducts(theKeyword).subscribe(
      data => this.products = data
    );
  }

  handleListProducts(): void {
    // Check if the "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // Get category id and convert from string to number the "+" operator
      // ts thinks the value might be null, even though we check for it,
      // thus it is suppressed with the below annotation.
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // if no category id is available then set the id to 1 as a default
      this.currentCategoryId = 1;
    }

    // now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => this.products = data
    );
  }

}
