import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductDto } from '@superstore/interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, OnDestroy {

    products: ProductDto[] = [];

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.productService.productsFilter$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(products => this.products = products);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
