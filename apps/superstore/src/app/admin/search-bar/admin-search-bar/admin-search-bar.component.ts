import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'superstore-admin-search-bar',
    templateUrl: './admin-search-bar.component.html',
    styleUrls: ['./admin-search-bar.component.scss']
})
export class AdminSearchBarComponent {
    static searchBar = new BehaviorSubject<string>('');

    searchValue = '';

    search(searchValue: string) {
        AdminSearchBarComponent.searchBar.next(searchValue);
    }

    clearSearch($event: Event) {
        if ($event instanceof KeyboardEvent && $event.key === 'Escape') {
            // Do nothing if Escape key is pressed
            this.searchValue = null;
            AdminSearchBarComponent.searchBar.next(null);
        }
    }
}
