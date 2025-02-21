import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { take } from 'rxjs';

@Component({
    selector: 'superstore-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    static displayResponsiveMenu = false;

    get displayResponsiveMenu(): boolean {
        return AppComponent.displayResponsiveMenu;
    }

    constructor(
        private readonly authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.signInWithAccessToken()
            .pipe(take(1))
            .subscribe();
    }
}
