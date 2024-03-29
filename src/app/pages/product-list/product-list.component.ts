import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { ActivatedRoute } from '@angular/router';
import { ProductInCart } from '../../model/product-in-cart';
import { CartService } from '../../services/cart.service';

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
  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private cartService: CartService) { }

  // Subscribe will execute in an asynchronous fashion.
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    if (this.route.snapshot.paramMap.has('keyword')) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(): void {
    const key: string = this.route.snapshot.paramMap.get('keyword') as string;
    this.productService.searchProducts(key).subscribe(
      products => this.products = products
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
      page => {
        this.products = page._embedded.products;
        this.pageNumber = page.page.number + 1;
        this.pageSize = page.page.size;
        this.totalElements = page.page.totalElements;
      }
    );
  }

  addToCart(product: Product): void {
    console.log(`Name: ${product.name} Price: ${product.unitPrice}`);
    this.cartService.addToCart(new ProductInCart(product));
  }
}
