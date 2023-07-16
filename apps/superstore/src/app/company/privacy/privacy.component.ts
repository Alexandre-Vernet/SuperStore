import { Component } from '@angular/core';

@Component({
    selector: 'superstore-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent {

    lastUpdated = new Date(2023, 6, 16);

    get lastUpdatedString(): string {
        return this.lastUpdated.toLocaleDateString();
    }
}
