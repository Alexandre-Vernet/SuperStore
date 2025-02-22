import { Component, OnInit } from '@angular/core';
import { UserDto } from '@superstore/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

    user: UserDto;

    protected readonly window = window;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.authService.user$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => this.user = user);
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
