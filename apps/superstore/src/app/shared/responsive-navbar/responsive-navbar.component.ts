import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";
import { Router } from "@angular/router";
import { UserDto } from "@superstore/libs";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'superstore-responsive-navbar',
    templateUrl: './responsive-navbar.component.html',
    styleUrls: ['./responsive-navbar.component.scss'],
})
export class ResponsiveNavbarComponent {

    constructor(
        private router: Router,
        private readonly authService: AuthService,
    ) {
    }

    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }

    redirectTo(url: string): void {
        this.router.navigateByUrl(url)
            .then(() => AppComponent.displayResponsiveMenu = false)
    }

    getUserConnected(): UserDto {
        return this.authService.user;
    }

    getFirstNameAndLastName(): string {
        return `${ this.getUserConnected().firstName } ${ this.getUserConnected().lastName }`;
    }

    signOut(): void {
        this.authService.signOut();
        this.router.navigate(['/']);
    }
}
