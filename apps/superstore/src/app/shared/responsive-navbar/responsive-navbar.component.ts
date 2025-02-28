import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'superstore-responsive-navbar',
    templateUrl: './responsive-navbar.component.html',
    styleUrls: ['./responsive-navbar.component.scss'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)', opacity: 0 }),
                animate('200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
            ])
        ]),
    ]
})
export class ResponsiveNavbarComponent {

    @Input() buttonOpenResponsiveMenu: ElementRef;
    @ViewChild('responsiveNavbarPanel') responsiveNavbar: ElementRef;

    @Output() hideResponsiveMenu$ = new Subject<void>;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly router: Router
    ) {
    }

    closeResponsiveMenu(): void {
        this.hideResponsiveMenu$.next();
    }

    redirectTo(url: string): void {
        this.router.navigateByUrl(url);
        this.hideResponsiveMenu$.next();
    }


    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const targetElement = event.target as HTMLElement;

        const clickedInsideMenu = this.responsiveNavbar?.nativeElement.contains(targetElement);
        const clickedInsideButtonOpenMenu = this.buttonOpenResponsiveMenu?.nativeElement.contains(targetElement);

        if (!clickedInsideMenu && !clickedInsideButtonOpenMenu) {
            this.closeResponsiveMenu();
        }
    }
}
