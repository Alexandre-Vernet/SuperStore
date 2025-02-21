import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const checkoutGuard = (): Observable<boolean> => {
    const router = inject(Router);

    const cartLocalStorage = JSON.parse(localStorage.getItem('cart'));

    if (cartLocalStorage && cartLocalStorage.length > 0) {
        return of(true);
    }

    router.navigate(['/cart']);
    return of(false);
};