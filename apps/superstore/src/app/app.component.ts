import { Component } from '@angular/core';

@Component({
    selector: 'superstore-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    static displayResponsiveMenu = false;

    get displayResponsiveMenu(): boolean {
        return AppComponent.displayResponsiveMenu;
    }
}
