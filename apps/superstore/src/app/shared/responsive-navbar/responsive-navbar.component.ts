import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'superstore-responsive-navbar',
    templateUrl: './responsive-navbar.component.html',
    styleUrls: ['./responsive-navbar.component.scss']
})
export class ResponsiveNavbarComponent {

    @Input() buttonOpenResponsiveMenu: ElementRef;
    @ViewChild('responsiveNavbarPanel') responsiveNavbar: ElementRef;

    @Output() displayResponsiveMenu$ = new Subject<void>;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly router: Router
    ) {
    }

    closeResponsiveMenu(): void {
        this.displayResponsiveMenu$.next();
    }

    redirectTo(url: string): void {
        this.router.navigateByUrl(url);
        this.displayResponsiveMenu$.next();
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
