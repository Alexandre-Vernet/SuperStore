import { Component } from '@angular/core';
import { ErrorService } from './error.service';

@Component({
    selector: 'superstore-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

    error: { title: string, message: string } = { title: '', message: '' };

    constructor(
        private readonly errorService: ErrorService
    ) {
        this.errorService.error$.subscribe(error => this.error = error);
    }
}
