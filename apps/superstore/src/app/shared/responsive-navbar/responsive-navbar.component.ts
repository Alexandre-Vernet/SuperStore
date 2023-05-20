import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { Router } from "@angular/router";

@Component({
    selector: 'superstore-responsive-navbar',
    templateUrl: './responsive-navbar.component.html',
    styleUrls: ['./responsive-navbar.component.scss'],
})
export class ResponsiveNavbarComponent {

    constructor(
        private router: Router
    ) {
    }

    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }

    redirectTo(url: string): void {
        this.router.navigateByUrl(url)
            .then(() => AppComponent.displayResponsiveMenu = false)
    }
}
