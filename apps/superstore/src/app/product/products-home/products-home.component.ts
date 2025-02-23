import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Component({
    selector: 'superstore-products-home',
    templateUrl: './products-home.component.html',
    styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent {
    protected readonly appName = environment.appName;

    applyFilter = new Subject<{ type: string; value: string }>();

    filter(value: { type: string; value: string }) {
        this.applyFilter.next(value);
    }
}
