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

  products: Product[] = [];
  currentCategoryID = 1;
  previousCategoryID = 1;
  searchMode = false;

  pageNumber = 1;
  pageSize = 10;
  totalElements = 0;

  // Inject ProductService
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  // Subscribe will execute in an asynchronous fashion.
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
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
    const categoryID = this.route.snapshot.paramMap.get('id');
    this.currentCategoryID = categoryID == null ? 1 : +categoryID; // The plus converts string to number.

    // Angular reuses components, therefore the page number must be reinitialized when switching categories
    if (this.previousCategoryID !== this.currentCategoryID) {
      this.pageNumber = 1;
    }
    this.previousCategoryID = this.currentCategoryID;

    // Note the page number increment and decrement. Spring Boot uses zero based indexing for its page numbers.
    this.productService.getPaginatedProductList(this.currentCategoryID, this.pageNumber - 1, this.pageSize).subscribe(
      data => {
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      }
    );
  }

  addToCart(product: Product): void {
    console.log(`Name: ${product.name} Price: ${product.unitPrice}`);
  }
}
