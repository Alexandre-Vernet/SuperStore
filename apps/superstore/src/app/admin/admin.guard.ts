import { catchError, Observable, of, switchMap, take } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const adminGuard = (): Observable<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.signInWithAccessToken()
        .pipe(
            take(1),
            switchMap(({ user }) => {
                if (!user.isAdmin) {
                    return handleError(authService, router, 'You`re not allowed to access this page');
                }
                return of(true);
            }),
            catchError(() => {
                return handleError(authService, router, 'Your session has expired, please sign-in again');
            })
        );
};

const handleError = (authService: AuthService, router: Router, error: string): Observable<boolean> => {
    authService.error = error;
    router.navigate(['/auth/sign-in']);
    return of(false);
};

