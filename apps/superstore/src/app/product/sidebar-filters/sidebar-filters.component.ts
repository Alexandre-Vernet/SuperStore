import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, map } from 'rxjs';

@Component({
    selector: 'superstore-sidebar-filters',
    templateUrl: './sidebar-filters.component.html',
    styleUrls: ['./sidebar-filters.component.scss']
})
export class SidebarFiltersComponent implements OnInit {
    protected readonly environment = environment;

    filterPrice = [
        {
            label: 'under-25',
            name: 'Under 25 €',
            checked: false
        },
        {
            label: '25-to-50',
            name: '25 € to 50 €',
            checked: false
        },
        {
            label: '50-to-100',
            name: '50 € to 100 €',
            checked: false
        },
        {
            label: '100-to-200',
            name: '100 € to 200 €',
            checked: false
        },
        {
            label: '200-and-above',
            name: '200 € and above',
            checked: false
        }
    ];
    sortBy = [
        {
            label: 'Price: Low to High',
            name: 'price',
            checked: false
        },
        {
            label: 'Price: High to Low',
            name: '-price',
            checked: false
        },
        {
            label: 'Name: A to Z',
            name: 'name',
            checked: false
        },
        {
            label: 'Name: Z to A',
            name: '-name',
            checked: false
        },
        {
            label: 'Best rating',
            name: '-rating',
            checked: false
        }
    ];
    sortByOpen = false;
    sortCurrent = '';
    filterCurrent = '';
    responsiveFilterOpen = false;

    categories$ = new BehaviorSubject<{ label: string, checked: boolean }[]>([]);
    categoryFilter$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        const categorySet = new Set<string>;
        this.productService.products$
            .subscribe(products =>
                products.map(product => {
                    if (!categorySet.has(product.category)) {
                        categorySet.add(product.category);
                        this.categories$.next([
                            ...this.categories$.getValue(),
                            {
                                label: product.category,
                                checked: false
                            }
                        ]);
                    }
                }));
    }

    setCategory(category: string) {
        this.categories$.subscribe(categories => categories.map(c => c.checked = c.label === category));
    }

    toggleSortBy() {
        this.sortByOpen = !this.sortByOpen;
    }

    toggleFilterResponsive() {
        this.responsiveFilterOpen = !this.responsiveFilterOpen;
    }

    closeSubMenus() {
        setTimeout(() => {
            this.responsiveFilterOpen = false;
            this.sortByOpen = false;
        }, this.responsiveFilterOpen ? 300 : 0);
    }

    setSortBy(sortBy: string) {
        this.closeSubMenus();

        // Uncheck all other sort by
        this.sortBy.map(f => {
            f.checked = f.name === sortBy;
        });

        this.productService.sortProducts(sortBy)
            .then(() => {
                this.sortCurrent = this.sortBy.find(f => f.name === sortBy).label;
            });
    }

    resetSortBy() {
        this.closeSubMenus();
        this.sortCurrent = '';

        // Uncheck all checkboxes
        this.sortBy.map(f => {
            f.checked = false;
        });

        this.productService.resetFilters();
    }

    setCategoriesFilter(category: string, $event) {
        this.categoryFilter$.next(category);
        // If checkbox is unchecked, reset filter
        if (!$event.target.checked) {
            this.resetCategoriesFilter();
            return;
        }

        // Uncheck all other categories
        this.categories$.getValue().map(f => {
            f.checked = f.label === category;
        });

        this.closeSubMenus();
    }

    resetCategoriesFilter() {
        this.closeSubMenus();

        // Uncheck all checkboxes
        this.categories$.pipe(
            map(c => c.map(categories => categories.checked = false))
        );

        this.productService.resetFilters();
    }

    setPriceFilter(label: string, $event) {
        // If checkbox is unchecked, reset filter
        if (!$event.target.checked) {
            this.resetPriceFilter();
            return;
        }

        this.closeSubMenus();

        // Uncheck all other price filters
        this.filterPrice.map(f => {
            f.checked = f.label === label;
        });

        this.productService.sortProductsByPrice(label)
            .then(() => {
                this.filterCurrent = this.filterPrice.find(f => f.label === label).name;
            });
    }

    resetPriceFilter() {
        this.closeSubMenus();
        this.filterCurrent = '';

        // Uncheck all checkboxes
        this.filterPrice.map(f => {
            f.checked = false;
        });

        this.productService.resetFilters();
    }
}
