import { Component, OnInit, Output } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductDto } from '@superstore/interfaces';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, combineLatest } from 'rxjs';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[] = [];

    @Output() category: BehaviorSubject<string> = new BehaviorSubject<string>('');


    constructor(
        private readonly productService: ProductService,
        private readonly activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.productService.products$,
            this.activatedRoute.queryParams
        ])
            .pipe(
                map(([products, param]: [ProductDto[], { category: string }]) => ({
                    products,
                    category: param.category
                })),
                map(({ products, category }) => ({
                        filteredProducts: category ? this.filterCategory(products, category) : products,
                        category
                    })
                )
            )
            .subscribe(({ filteredProducts, category }) => {
                this.products = filteredProducts;
                this.category.next(category);
            });
    }

    filterCategory(products: ProductDto[], category: string) {
        return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
}
