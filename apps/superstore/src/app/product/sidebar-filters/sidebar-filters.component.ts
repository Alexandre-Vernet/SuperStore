import { Component, OnInit } from '@angular/core';
import { categories, filterPrice, sortBy } from "@superstore/interfaces";
import { ProductService } from "../product.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'superstore-sidebar-filters',
    templateUrl: './sidebar-filters.component.html',
    styleUrls: ['./sidebar-filters.component.scss'],
})
export class SidebarFiltersComponent implements OnInit {
    filterPrice = filterPrice;
    sortBy = sortBy;
    sortByOpen = false;
    sortCurrent = '';
    filterCurrent = '';
    responsiveFilterOpen = false;
    categories = categories;

    constructor(
        private readonly productService: ProductService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.productService.products
            .subscribe(products => {
                // Get category from URL and filter products
                this.activatedRoute.queryParams
                    .subscribe((params: { category: string }) => {
                        if (params.category) {
                            this.productService.filterProductsByCategory(params.category);
                        }
                    });

                // List all categories
                products.map(product => {
                    if (product.category) {
                        product.category.map(c => {
                            if (!this.categories.map(c => c.label).includes(c)) {
                                this.categories.push({ label: c, checked: false });
                            }
                        });
                    }
                });
            });
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
        // If checkbox is unchecked, reset filter
        if (!$event.target.checked) {
            this.resetCategoriesFilter();
            return;
        }

        // Uncheck all other categories
        this.categories.map(f => {
            f.checked = f.label === category;
        });

        this.closeSubMenus();

        this.productService.filterProductsByCategory(category);
    }

    resetCategoriesFilter() {
        this.closeSubMenus();

        // Uncheck all checkboxes
        this.categories = categories;

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
