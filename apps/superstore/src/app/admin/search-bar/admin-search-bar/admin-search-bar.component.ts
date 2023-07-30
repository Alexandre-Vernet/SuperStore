import { Component } from '@angular/core';
import { SearchBar } from "../search-bar";

@Component({
    selector: 'superstore-admin-search-bar',
    templateUrl: './admin-search-bar.component.html',
    styleUrls: ['./admin-search-bar.component.scss'],
})
export class AdminSearchBarComponent {
    searchValue = '';

    search(event: Event) {
        const search = (event.target as HTMLInputElement).value;
        if (event instanceof KeyboardEvent && event.key === 'Escape') {
            // Do nothing if Escape key is pressed
            this.searchValue = '';
            return;
        }
        SearchBar.searchBar.next(search);
    }
}
