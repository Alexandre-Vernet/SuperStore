import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service';
import { ReviewService } from '../../review/review.service';
import { ProductDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-responsive-sidebar',
    templateUrl: './responsive-sidebar.component.html',
    styleUrls: ['./responsive-sidebar.component.scss']
})
export class ResponsiveSidebarComponent implements OnInit, OnDestroy {

    sortBy = [
        {
            value: '-price',
            displayName: 'Price: Low to High',
            checked: false
        },
        {
            value: '+price',
            displayName: 'Price: High to Low',
            checked: false
        },
        {
            value: '+name',
            displayName: 'Name: A to Z',
            checked: false
        },
        {
            value: '-name',
            displayName: 'Name: Z to A',
            checked: false
        },
        {
            value: '+rating',
            displayName: 'Best rating',
            checked: false
        }
    ];
    filterPrice = [
        {
            value: 'under-25',
            displayName: 'Under 25 €',
            checked: false
        },
        {
            value: '25-to-50',
            displayName: '25 € to 50 €',
            checked: false
        },
        {
            value: '50-to-100',
            displayName: '50 € to 100 €',
            checked: false
        },
        {
            value: '100-to-200',
            displayName: '100 € to 200 €',
            checked: false
        },
        {
            value: '200-and-above',
            displayName: '200 € and above',
            checked: false
        }
    ];
    categories: { label: string, checked: boolean }[] = [];

    responsiveFilterOpen = false;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
        private readonly reviewService: ReviewService
    ) {
    }

    ngOnInit() {
        this.productService.findAllProducts()
            .pipe(
                takeUntil(this.unsubscribe$),
                map((products: ProductDto[]) => {
                    const categorySet = new Set<string>;
                    products.forEach(product => {
                        if (!categorySet.has(product.category)) {
                            categorySet.add(product.category);
                        }
                    });
                    return categorySet;
                })
            )
            .subscribe(categories => {
                this.categories = Array.from(categories)
                    .map(c => ({
                        label: c,
                        checked: false
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    toggleFilterResponsive() {
        this.responsiveFilterOpen = !this.responsiveFilterOpen;
    }


    setFilter(type: 'sortBy' | 'priceRange' | 'category', $event: MouseEvent | string) {
        if (!$event) {
            return;
        }

        this.closeResponsiveMenu();
        const id = $event instanceof MouseEvent ? ($event.target as HTMLInputElement).id : $event;

        if ($event instanceof MouseEvent && !(<HTMLInputElement>$event.target).checked) {
            this.resetFilter(type);
            return;
        }

        const sortBy = this.sortBy.find(f => f.value === id)?.value;
        const priceRange = this.filterPrice.find(f => f.value === id)?.value;
        const category = this.categories.find(f => f.label === id)?.label;

        switch (type) {
            case 'sortBy':
                this.sortBy.map(f => f.checked = f.value === id);
                this.sortProducts(sortBy, priceRange, category);
                break;
            case 'priceRange':
                this.filterPrice.map(f => f.checked = f.value === id);
                this.sortProducts(sortBy, priceRange, category);
                break;
            case 'category':
                this.categories.map(f => f.checked = f.label === id);
                this.sortProducts(sortBy, priceRange, id);
                break;
            default:
                break;
        }
    }

    resetFilter(type: 'sortBy' | 'priceRange' | 'category') {
        switch (type) {
            case 'sortBy':
                this.sortBy.map(f => f.checked = false);
                break;
            case 'priceRange':
                this.filterPrice.map(f => f.checked = false);
                break;
            case 'category':
                this.categories.map(f => f.checked = false);
                break;
            default:
                break;
        }
    }

    closeResponsiveMenu() {
        setTimeout(() => this.responsiveFilterOpen = false, this.responsiveFilterOpen ? 300 : 0);
    }

    sortProducts(sortBy: string, priceRange: string, category: string) {
        // let filteredProducts = [...this.productsSubject.value];
        //
        // if (sortBy) {
        //     this.filterProductsByLabel(sortBy, filteredProducts)
        //         .pipe(
        //             map(sortedProducts => {
        //                 filteredProducts = sortedProducts;
        //                 return filteredProducts;
        //             }),
        //             switchMap(() => {
        //                 if (category) {
        //                     filteredProducts = this.filterProductsByCategory(category, filteredProducts);
        //                 }
        //                 if (priceRange) {
        //                     filteredProducts = this.filterByPriceRange(priceRange, filteredProducts);
        //                 }
        //                 return of(filteredProducts);
        //             })
        //         )
        //         .subscribe(finalFilteredProducts => this.productsSubjectFiltered.next(finalFilteredProducts));
        // } else {
        //     if (category) {
        //         filteredProducts = this.filterProductsByCategory(category, filteredProducts);
        //     }
        //
        //     if (priceRange) {
        //         filteredProducts = this.filterByPriceRange(priceRange, filteredProducts);
        //     }
        //
        //     this.productsSubjectFiltered.next(filteredProducts);
        // }
    }


    private filterProductsByCategory(category: string, filteredProducts: ProductDto[]) {
        return filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    private filterByPriceRange(priceRange: string, filteredProducts: ProductDto[]) {
        switch (priceRange) {
            case '25-to-50':
                return filteredProducts.filter((p) => p.price >= 25 && p.price < 50);
            case '50-to-100':
                return filteredProducts.filter((p) => p.price >= 50 && p.price < 100);
            case '100-to-200':
                return filteredProducts.filter((p) => p.price >= 100 && p.price < 200);
            case '200-and-above':
                return filteredProducts.filter((p) => p.price >= 200);
            case 'under-25':
            default:
                return filteredProducts.filter((p) => p.price < 25);
        }
    }

    private filterProductsByLabel(label: string, filteredProducts: ProductDto[]): Observable<ProductDto[]> {
        switch (label) {
            case '+price':
                return of(filteredProducts.sort((a, b) => b.price - a.price));
            case '+name':
                return of(filteredProducts.sort((a, b) => a.name.localeCompare(b.name)));
            case '-name':
                return of(filteredProducts.sort((a, b) => b.name.localeCompare(a.name)));
            case '+rating': {
                return this.reviewService.findAllReviews()
                    .pipe(
                        map(reviews => {
                            const productsWithRating = filteredProducts.map(product => {
                                const productReviews = reviews.filter(review => review.product.id === product.id);
                                const rating = productReviews.length > 0 ?
                                    productReviews.map(review => review.rating).reduce((a, b) => a + b) / productReviews.length :
                                    0;
                                return { ...product, rating };
                            });
                            return productsWithRating.sort((a, b) => b.rating - a.rating);
                        })
                    );
            }
            case '-price':
            default:
                return of(filteredProducts.sort((a, b) => a.price - b.price));
        }
    }
}
