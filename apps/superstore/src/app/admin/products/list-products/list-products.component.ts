import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductDto } from '@superstore/interfaces';
import { ProductService } from '../../../product/product.service';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { AdminSearchBarComponent } from '../../search-bar/admin-search-bar/admin-search-bar.component';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, OnDestroy {

    products: ProductDto[];
    filteredProducts: ProductDto[];

    editedProduct: ProductDto;
    showModalAddProduct = false;

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 12,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.productService.products$,
            AdminSearchBarComponent.searchBar
        ])
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(([products]) => products.sort((a, b) => a?.id - b?.id)),
                tap(([products]) => this.pagination.totalPage.next(Math.ceil(products.length / this.pagination.itemsPerPage)))
            )
            .subscribe(([products, search]) => {
                this.products = products;

                if (search) {
                    this.filteredProducts = products.filter(product =>
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase()) ||
                        product.category.toLowerCase().includes(search.toLowerCase())
                    );
                } else {
                    this.filteredProducts = [...this.products];
                }
                // Reset pagination to first page after filtering
                this.pagination.currentPage.next(1);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
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
        this.productService.deleteProduct(product.id)
            .subscribe();
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
