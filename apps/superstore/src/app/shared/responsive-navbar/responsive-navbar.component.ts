import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";

@Component({
    selector: 'superstore-responsive-navbar',
    templateUrl: './responsive-navbar.component.html',
    styleUrls: ['./responsive-navbar.component.scss'],
})
export class ResponsiveNavbarComponent {

    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }
}
