import { Component } from '@angular/core';
import { filterPrice, sortBy } from "@superstore/interfaces";
import { ProductService } from "../product.service";

@Component({
    selector: 'superstore-sidebar-filters',
    templateUrl: './sidebar-filters.component.html',
    styleUrls: ['./sidebar-filters.component.scss'],
})
export class SidebarFiltersComponent {
    filterPrice = filterPrice;
    sortBy = sortBy;
    sortByOpen = false;
    sortCurrent = '';
    filterCurrent = '';
    responsiveFilterOpen = false;

    constructor(
        private readonly productService: ProductService
    ) {
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

        // Uncheck all other price filters
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

    setPriceFilter(label: string) {
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
