import { Component, HostListener, OnInit } from '@angular/core';
import { ProductDto } from "@superstore/interfaces";
import { ProductService } from "../../../product/product.service";
import { AdminService } from "../../admin.service";

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[];
    editedProduct: ProductDto;
    searchBar = '';

    constructor(
        private readonly productService: ProductService,
        public adminService: AdminService
    ) {
    }

    ngOnInit() {
        this.productService.products
            .subscribe((products) => {
                products.sort((a, b) => a.id - b.id);
                this.products = products;
            });
    }

    displayModalAddProduct() {
        this.editedProduct = null;
        this.adminService.openModal();
    }

    editProduct(product: ProductDto) {
        this.editedProduct = product;
        this.adminService.openModal();
    }

    deleteProduct(product: ProductDto) {
        this.productService.deleteProduct(product.id).subscribe();
    }

    // Escape key to clear search bar
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (this.searchBar.length > 0) {
            this.searchBar = '';
        }
    }
}
