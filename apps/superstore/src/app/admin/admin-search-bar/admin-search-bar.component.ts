import { Component, HostListener } from '@angular/core';
import { AdminService } from "../admin.service";

@Component({
    selector: 'superstore-admin-search-bar',
    templateUrl: './admin-search-bar.component.html',
    styleUrls: ['./admin-search-bar.component.scss'],
})
export class AdminSearchBarComponent {

    constructor(
        private readonly adminService: AdminService
    ) {
    }

    search(event: Event) {
        const search = (event.target as HTMLInputElement).value;
        this.adminService.searchBar.next(search);
    }

    // Escape key to clear search bar
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (this.adminService.searchBar.getValue().length > 0) {
            this.adminService.searchBar.next('');
        }
    }
}
