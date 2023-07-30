import { Component } from '@angular/core';
import { UserDto } from "@superstore/interfaces";
import { AuthService } from "../../../auth/auth.service";
import { Router } from "@angular/router";
import { AppComponent } from "../../../app.component";

@Component({
    selector: 'superstore-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    getScreenWidth(): number {
        return window.innerWidth;
    }

    getUserConnected(): UserDto {
        return this.authService.user;
    }

    getFirstNameAndLastName(): string {
        return `${ this.getUserConnected().firstName } ${ this.getUserConnected().lastName }`;
    }

    userIsAdmin(): boolean {
        return this.authService.user.isAdmin;
    }

    redirectTo(path: string) {
        this.router.navigateByUrl(path);
        AppComponent.displayResponsiveMenu = false;
    }

    signOut() {
        this.authService.signOut();
        this.router.navigateByUrl('/');
    }
}
