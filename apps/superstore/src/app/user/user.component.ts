import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'superstore-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

    currentRoute: string;
    menu: { label: string, link: string, icon: string }[] = [
        {
            label: 'Profile',
            link: '/user/profile',
            icon: 'assets/icons/user/profile.svg'
        },
        {
            label: 'Security',
            link: '/user/security',
            icon: 'assets/icons/user/security.svg'
        },
        {
            label: 'Addresses',
            link: '/user/address',
            icon: 'assets/icons/user/address.svg'
        },
    ];

    constructor(
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.router.events
            .subscribe(() => {
                this.currentRoute = this.router.url;
            });
    }
}
