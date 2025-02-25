import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScreenService } from '../../screen.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    displayResponsiveMenu = false;
    isResponsive = false;

    @ViewChild('btnOpenResponsiveMenu') buttonOpenResponsiveMenu: ElementRef;

    unsubscribe$ = new Subject<void>;

    constructor(
        private readonly screenService: ScreenService
    ) {
    }

    ngOnInit() {
        this.screenService.isResponsive$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(isResponsive => this.isResponsive = isResponsive);
    }

    openResponsiveMenu() {
        this.displayResponsiveMenu = true;
    }

    hideResponsiveMenu(): void {
        this.displayResponsiveMenu = false;
    }
}
