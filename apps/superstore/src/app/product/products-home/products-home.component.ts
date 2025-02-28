import { Component, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Component({
    selector: 'superstore-products-home',
    templateUrl: './products-home.component.html',
    styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent {
    protected readonly appName = environment.appName;

    isResponsive = window.innerWidth < 1023;

    applyFilter$ = new Subject<{ type: string; value: string }>();

    filter(value: { type: string; value: string }) {
        this.applyFilter$.next(value);
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.isResponsive = window.innerWidth < 1023;
    }
}
