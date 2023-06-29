import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateUserDto, SignInUserDto, UserDto } from "@superstore/interfaces";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: UserDto;
    authUrl = environment.authUrl();
    error = '';

    constructor(
        private http: HttpClient,
        private readonly notificationService: NotificationsService,
    ) {
    }

    signIn(user: SignInUserDto): Observable<{ user: UserDto, accessToken: string }> {
        return this.http.post<{ user: UserDto, accessToken: string }>(`${ this.authUrl }/sign-in`, user)
            .pipe(
                tap(res => {
                    this.user = res.user;
                    localStorage.setItem('accessToken', res.accessToken);
                })
            );
    }

    signUp(user: CreateUserDto): Observable<{ accessToken: string, user: UserDto }> {
        return this.http.post<{ accessToken: string, user: UserDto }>(`${ this.authUrl }/sign-up`, user)
            .pipe(
                tap((res) => localStorage.setItem('accessToken', res.accessToken))
            );
    }

    signInWithAccessToken(): Observable<{ user: UserDto, accessToken: string }> {
        const accessToken = localStorage.getItem('accessToken');
        return this.http.post<{
            user: UserDto,
            accessToken: string
        }>(`${ this.authUrl }/sign-in-with-access-token`, { accessToken })
            .pipe(
                tap(res => {
                    this.user = res.user;
                    localStorage.setItem('accessToken', res.accessToken);
                })
            );
    }

    updatePassword(password: string): Observable<void> {
        const userId = this.user.id;
        return this.http.put<void>(`${ this.authUrl }/update-password`, { userId, password })
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Password updated successfully');
                }),
                catchError(err => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    signOut(): void {
        this.user = null;
        localStorage.removeItem('accessToken');
    }
}
