import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { CartDto, UserDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

    user: UserDto;
    cart: CartDto[] = [];

    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }

    getScreenWidth(): number {
        return window.innerWidth;
    }
}
