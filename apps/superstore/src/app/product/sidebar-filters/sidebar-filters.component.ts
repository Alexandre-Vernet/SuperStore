import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductDto } from '@superstore/interfaces';
import { map, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
    selector: 'superstore-sidebar-filters',
    templateUrl: './sidebar-filters.component.html',
    styleUrls: ['./sidebar-filters.component.scss']
})
export class SidebarFiltersComponent implements OnInit, OnDestroy {

    label = [
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

    @Output() filter$ = new Subject<{ type: string, value: string }>();
    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
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

    setFilter(type: 'label' | 'priceRange' | 'category', $event: MouseEvent | string) {
        if (!$event) {
            return;
        }

        this.closeResponsiveMenu();
        const id = $event instanceof MouseEvent ? ($event.target as HTMLInputElement).id : $event;

        if ($event instanceof MouseEvent && !(<HTMLInputElement>$event.target).checked) {
            this.resetFilter(type);
            return;
        }

        const label = this.label.find(f => f.value === id)?.value;
        const priceRange = this.filterPrice.find(f => f.value === id)?.value;
        const category = this.categories.find(f => f.label === id)?.label;

        switch (type) {
            case 'label':
                this.label.map(f => f.checked = f.value === id);
                this.sortProducts(label, priceRange, category);
                break;
            case 'priceRange':
                this.filterPrice.map(f => f.checked = f.value === id);
                this.sortProducts(label, priceRange, category);
                break;
            case 'category':
                this.categories.map(f => f.checked = f.label === id);
                this.sortProducts(label, priceRange, id);
                break;
            default:
                break;
        }
    }

    resetFilter(type: 'label' | 'priceRange' | 'category') {
        switch (type) {
            case 'label':
                this.label.map(f => f.checked = false);
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

    sortProducts(label: string, priceRange: string, category: string) {
        if (label) {
            this.filter$.next({
                type: 'label',
                value: label
            });
        }
        if (category) {
            this.filter$.next({
                type: 'category',
                value: category
            });
        }
        if (priceRange) {
            this.filter$.next({
                type: 'priceRange',
                value: priceRange
            });
        }
    }
}
