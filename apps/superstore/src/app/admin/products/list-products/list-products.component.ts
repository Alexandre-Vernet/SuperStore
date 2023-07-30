import { Component, OnInit } from '@angular/core';
import { ProductDto } from "@superstore/interfaces";
import { ProductService } from "../../../product/product.service";
import { SearchBar } from "../../search-bar/search-bar";

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[];
    editedProduct: ProductDto;
    searchBar = '';
    showModalAddProduct = false;

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        this.productService.products
            .subscribe((products) => {
                products.sort((a, b) => a.id - b.id);
                this.products = products;
            });

        SearchBar.searchBar
            .subscribe((search) => {
                this.searchBar = search;
            });
    }

    openModal() {
        this.showModalAddProduct = true;
    }

    closeModal() {
        this.showModalAddProduct = false;
    }

    addProduct() {
        this.editedProduct = null;
        this.openModal();
    }

    editProduct(product: ProductDto) {
        this.editedProduct = product;
        this.openModal();
    }

    deleteProduct(product: ProductDto) {
        this.productService.deleteProduct(product.id).subscribe();
    }
}
