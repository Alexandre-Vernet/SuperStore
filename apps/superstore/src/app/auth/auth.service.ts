import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDto } from '@superstore/interfaces';
import { NotificationsService } from '../shared/notifications/notifications.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userSubject = new BehaviorSubject<UserDto>(null);
    user$ = this.userSubject.asObservable();
    
    authUrl = environment.authUrl();
    error = '';

    constructor(
        private http: HttpClient,
        private readonly notificationService: NotificationsService
    ) {
    }

    signIn(user: Pick<UserDto, 'email' | 'password'>): Observable<{ user: UserDto, accessToken: string }> {
        return this.http.post<{ user: UserDto, accessToken: string }>(`${ this.authUrl }/sign-in`, user)
            .pipe(
                tap(({ user, accessToken }) => {
                    this.userSubject.next(user);
                    localStorage.setItem('accessToken', accessToken);
                })
            );
    }

    signUp(user: UserDto): Observable<{ accessToken: string, user: UserDto }> {
        return this.http.post<{ accessToken: string, user: UserDto }>(`${ this.authUrl }/sign-up`, user)
            .pipe(
                tap(({accessToken}) => localStorage.setItem('accessToken', accessToken))
            );
    }

    signInWithAccessToken(): Observable<{ user: UserDto, accessToken: string }> {
        const accessToken = localStorage.getItem('accessToken');
        return this.http.post<{
            user: UserDto,
            accessToken: string
        }>(`${ this.authUrl }/sign-in-with-access-token`, { accessToken })
            .pipe(
                tap(({ user, accessToken }) => {
                    this.userSubject.next(user);
                    localStorage.setItem('accessToken', accessToken);
                })
            );
    }

    updatePassword(password: string, confirmPassword: string): Observable<void> {
        const userId = this.userSubject.value.id;
        return this.http.put<void>(`${ this.authUrl }/update-password`, { userId, password, confirmPassword })
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Password updated successfully');
                }),
            );
    }

    sendEmailForgotPassword(email: string): Observable<void> {
        return this.http.post<void>(`${ this.authUrl }/send-email-reset-password`, { email })
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'An email has been sent with instructions to reset your password');
                }),
                catchError(err => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    return of(null);
                })
            );
    }

    signOut(): void {
        this.userSubject.next(null);
        localStorage.removeItem('accessToken');
    }
}
