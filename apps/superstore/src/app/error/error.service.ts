import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    private errorSubject = new Subject<{ title: string, message: string }>();
    error$ = this.errorSubject.asObservable();

    constructor() {
    }

    setError(message: string) {
        window.scrollTo(0, 0);
        this.errorSubject.next({ title: 'error', message });
    }
}
