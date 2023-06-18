import { Component } from '@angular/core';
import { AdminService } from "../admin.service";

@Component({
    selector: 'superstore-admin-search-bar',
    templateUrl: './admin-search-bar.component.html',
    styleUrls: ['./admin-search-bar.component.scss'],
})
export class AdminSearchBarComponent {
    searchValue = '';

    constructor(
        private readonly adminService: AdminService
    ) {
    }

    search(event: Event) {
        const search = (event.target as HTMLInputElement).value;
        if (event instanceof KeyboardEvent && event.key === 'Escape') {
            // Do nothing if Escape key is pressed
            this.searchValue = '';
            return;
        }
        this.adminService.searchBar.next(search);
    }
}
