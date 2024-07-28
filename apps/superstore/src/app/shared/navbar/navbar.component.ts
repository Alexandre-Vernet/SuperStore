import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { OrderProductDto, UserDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

    user: UserDto;
    cart: OrderProductDto[] = [];

    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }

    getScreenWidth(): number {
        return window.innerWidth;
    }
}
