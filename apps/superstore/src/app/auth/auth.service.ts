import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateUserDto, SignInUserDto, UserDto } from "@superstore/interfaces";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: UserDto;
    authUrl = environment.authUrl();
    error = '';

    constructor(
        private http: HttpClient,
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

    signUp(user: CreateUserDto): Observable<void> {
        return this.http.post<void>(`${ this.authUrl }/sign-up`, user)
            .pipe(
                tap(() => this.signIn({ email: user.email, password: user.password }))
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

    signOut(): void {
        this.user = null;
        localStorage.removeItem('accessToken');
    }
}
