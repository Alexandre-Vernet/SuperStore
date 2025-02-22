import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductDto } from '@superstore/interfaces';
import { ProductService } from '../../../product/product.service';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { AdminSearchBarComponent } from '../../search-bar/admin-search-bar/admin-search-bar.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, OnDestroy {

    products: ProductDto[] = [];
    filteredProducts: ProductDto[] = [];

    editedProduct: ProductDto;
    showModalAddProduct = false;

    noResultSearch = false;

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 25,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.productService.findAllProducts(),
            AdminSearchBarComponent.searchBar
        ])
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(([products]) => products.sort((a, b) => a?.id - b?.id)),
                tap(([products]) => this.pagination.totalPage.next(Math.ceil(products.length / this.pagination.itemsPerPage)))
            )
            .subscribe(([products, search]) => {
                this.products = products;

                if (!search) {
                    this.filteredProducts = [...this.products];
                    this.noResultSearch = false;
                } else {
                    this.pagination.totalPage.next(0);

                    this.filteredProducts = products.filter(product =>
                        product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.description.toLowerCase().includes(search.toLowerCase()) ||
                        product.category.toLowerCase().includes(search.toLowerCase())
                    );

                    this.noResultSearch = this.filteredProducts.length === 0;
                }

                this.pagination.currentPage.next(1);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    openModalAddProduct() {
        this.showModalAddProduct = true;
    }

    updateProduct(updatedProduct: ProductDto) {
        this.showModalAddProduct = false;

        if (updatedProduct) {
            const index = this.products.findIndex(o => o.id === updatedProduct.id);
            this.products[index] = updatedProduct;
            this.filteredProducts = [...this.products];
        }
    }

    editProduct(product: ProductDto) {
        this.editedProduct = product;
        this.openModalAddProduct();
    }

    deleteProduct(product: ProductDto) {
        this.productService.deleteProduct(product.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.notificationService.showSuccessNotification('Success', 'Product deleted successfully');
                    this.products = this.products.filter((p) => p.id !== product.id);
                    this.filteredProducts = [...this.products];
                }
            });
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
