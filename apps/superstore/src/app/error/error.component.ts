import { Component, OnDestroy } from '@angular/core';
import { ErrorService } from './error.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnDestroy {

    error: { title: string, message: string } = { title: '', message: '' };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly errorService: ErrorService
    ) {
        this.errorService.error$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(error => this.error = error);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
