import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'superstore-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

   static displayResponsiveMenu = false;

    ngOnInit(): void {
        window.addEventListener('resize', () => {
            AppComponent.displayResponsiveMenu = window.innerWidth < 768;
        });
    }

    get displayResponsiveMenu(): boolean {
        return AppComponent.displayResponsiveMenu;
    }
}
