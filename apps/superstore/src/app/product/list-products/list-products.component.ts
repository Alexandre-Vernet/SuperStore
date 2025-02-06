import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductDto } from '@superstore/interfaces';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, OnDestroy {

    products: ProductDto[] = [];

    pagination = {
        currentPage:  new BehaviorSubject<number>(1),
        itemsPerPage: 12,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.productService.productsFilter$
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(products => this.pagination.totalPage.next(Math.ceil(products.length / this.pagination.itemsPerPage)))
            )
            .subscribe(products => this.products = products);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
