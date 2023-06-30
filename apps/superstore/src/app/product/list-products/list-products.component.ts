import { Component, OnInit } from '@angular/core';
import { ProductService } from "../product.service";
import { ProductDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[] = [];
    pagination: { page: number, limit: number, pages: number[], totalProduct: number } = {
        page: 1,
        limit: localStorage.getItem('limit') ? parseInt(localStorage.getItem('limit'), 10) : 10,
        pages: [],
        totalProduct: 0,
    };
    limitOptions = [10, 25, 50, 100];

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        this.getProducts();
    }

    getProducts(page: number = 1) {
        if (page) {
            this.pagination.page = page;
        }

        return this.productService
            .getProducts(
                this.pagination.limit,
                page,
            )
            .subscribe(result => {
                const { products, total } = result;
                this.products = products;
                this.addPagination(total, page);
            });
    }

    addPagination(totalProduct: number, page: number) {
        const totalPage = Math.ceil(totalProduct / this.pagination.limit);
        let startPage = Math.max(1, page - 3);
        let endPage = Math.min(totalPage, page + 3);
        if (startPage === 1) {
            endPage = Math.min(6, totalPage);
        } else if (endPage === totalPage) {
            startPage = Math.max(totalPage - 5, 1);
        }


        this.pagination = {
            page,
            limit: this.pagination.limit,
            pages: Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
            ),
            totalProduct: totalProduct,
        };
    }

    updateOrderBy($event: Event) {
        const orderBy = (<HTMLInputElement>$event.target).value;
        this.productService.sortProducts(this.products, orderBy)
            .then(products => {
                this.products = products;
            });
    }

    getPage(page: number) {
        if (page === this.pagination.page) {
            return;
        }
        if (page < 1 || page > this.pagination.pages.length) {
            return;
        }
        this.getProducts(page);
    }

    updateLimit($event: Event) {
        const limit = parseInt((<HTMLInputElement>$event.target).value, 10);
        const limitParsed = (<HTMLInputElement>$event.target).value;
        localStorage.setItem('limit', limitParsed);
        this.pagination.limit = limit;
        this.getProducts(this.pagination.page);
        this.scrollToBottom();
    }

    scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }
}
