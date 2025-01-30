import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { environment } from '../../../environments/environment';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-sidebar-filters',
    templateUrl: './sidebar-filters.component.html',
    styleUrls: ['./sidebar-filters.component.scss']
})
export class SidebarFiltersComponent implements OnInit, OnDestroy {
    protected readonly appName = environment.appName;

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

    sortCurrent = '';
    filterCurrent = '';
    responsiveFilterOpen = false;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        const categorySet = new Set<string>;

        combineLatest([
            this.productService.products$,
            this.activatedRoute.queryParams
        ])
            .pipe(
                takeUntil(this.unsubscribe$),
                map(([products, param]: [ProductDto[], { category: string }]) => {
                    products.forEach(product => {
                        if (!categorySet.has(product.category)) {
                            categorySet.add(product.category);
                            this.categories = [
                                ...this.categories,
                                {
                                    label: product.category,
                                    checked: false
                                }
                            ]
                                .sort((a, b) => a.label.localeCompare(b.label));
                        }
                    });
                    return param;
                }),
                map(param => param?.category?.toLowerCase())
            )
            .subscribe(category => {
                this.categories.map(f => f.checked = f.label === category);
                this.updateRouteQueryParams(category);
                this.setFilter('category', category);
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
                this.productService.sortProducts(sortBy, priceRange, category);
                break;
            case 'priceRange':
                this.filterPrice.map(f => f.checked = f.value === id);
                this.productService.sortProducts(sortBy, priceRange, category);
                break;
            case 'category':
            default:
                this.updateRouteQueryParams(id);
                this.categories.map(f => f.checked = f.label === id);
                this.productService.sortProducts(sortBy, priceRange, id);
                break;
        }
    }

    resetFilter(type: 'sortBy' | 'priceRange' | 'category') {
        this.productService.resetFilters();
        switch (type) {
            case 'sortBy':
                this.sortBy.map(f => f.checked = false);
                break;
            case 'priceRange':
                this.filterPrice.map(f => f.checked = false);
                break;
            case 'category':
            default:
                this.updateRouteQueryParams(null);
                this.categories.map(f => f.checked = false);
                break;
        }
    }

    updateRouteQueryParams(category: string) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { category },
            queryParamsHandling: 'merge'
        });
    }

    closeResponsiveMenu() {
        setTimeout(() => this.responsiveFilterOpen = false, this.responsiveFilterOpen ? 300 : 0);
    }
}
