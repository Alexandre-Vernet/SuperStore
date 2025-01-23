import { Component, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductDto } from '@superstore/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[] = [];

    @Input() categoryFilter$: BehaviorSubject<string> = new BehaviorSubject('');
    @Output() category$: BehaviorSubject<string> = new BehaviorSubject('');


    constructor(
        private readonly productService: ProductService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.productService.products$,
            this.categoryFilter$,
            this.activatedRoute.queryParams
        ])
            .pipe(
                map(([products, categoryFilter, param]: [ProductDto[], string, { category: string }]) => ({
                    products,
                    category: categoryFilter ? categoryFilter : param.category
                })),
                map(({ products, category }) => ({
                        filteredProducts: category ? this.filterCategory(products, category) : products,
                        category
                    })
                )
            )
            .subscribe(({ filteredProducts, category }) => {
                this.products = filteredProducts;
                this.category$.next(category);

                this.router.navigate([], {
                    relativeTo: this.activatedRoute,
                    queryParams: { category },
                    queryParamsHandling: 'merge'
                });
            });
    }

    filterCategory(products: ProductDto[], category: string) {
        return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
}
