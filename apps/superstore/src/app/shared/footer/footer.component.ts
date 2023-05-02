import { Component } from '@angular/core';

@Component({
    selector: 'superstore-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

    getCurrentYear(): number {
        return new Date().getFullYear();
    }
}
