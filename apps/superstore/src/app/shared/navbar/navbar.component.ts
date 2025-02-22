import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { OrderProductDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    cart: OrderProductDto[] = [];

    protected readonly window = window;


    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }
}
