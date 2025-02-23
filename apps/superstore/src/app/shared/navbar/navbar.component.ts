import { Component, HostListener } from '@angular/core';
import { AppComponent } from '../../app.component';
import { OrderProductDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    cart: OrderProductDto[] = [];

    isResponsive = window.innerWidth < 1023;


    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.isResponsive = window.innerWidth < 1023;
    }
}
