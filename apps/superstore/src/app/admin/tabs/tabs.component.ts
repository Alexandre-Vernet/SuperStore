import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'superstore-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {

    tabs = [
        { label: 'Products', link: '/admin/list-products' },
        { label: 'Orders', link: '/admin/list-orders' },
        { label: 'Users', link: '/admin/list-users' },
        { label: 'Newsletter', link: '/admin/send-newsletter' },
        { label: 'Promotions', link: '/admin/list-promotions-code' },
    ];

    activeTab = this.tabs[0].link;

    constructor(
        private router: Router
    ) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.activeTab = event.url;
        });
    }

    navigateTo(event: Event) {
        const url: string = (event.target as HTMLInputElement).value;
        this.router.navigateByUrl(url);
    }
}
