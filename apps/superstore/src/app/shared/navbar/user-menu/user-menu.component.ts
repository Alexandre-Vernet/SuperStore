import { Component, OnInit, Output } from '@angular/core';
import { UserDto } from '@superstore/interfaces';
import { AuthService } from '../../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ScreenService } from '../../../screen.service';

@Component({
    selector: 'superstore-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

    isResponsive: boolean;
    @Output() redirectToRoute$ = new Subject<string>;
    user: UserDto;

    protected readonly window = window;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly authService: AuthService,
        private readonly screenService: ScreenService
    ) {
    }

    ngOnInit() {
        this.screenService.isResponsive$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isResponsive => this.isResponsive = isResponsive);

        this.authService.user$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => this.user = user);
    }

    redirectTo(path: string) {
        this.redirectToRoute$.next(path);
    }

    signOut() {
        this.authService.signOut();
        this.redirectTo('/');
    }
}
