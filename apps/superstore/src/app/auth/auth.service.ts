import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateUserDto, SignInUserDto, UserDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: UserDto;
    authUrl = environment.authUrl();

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

    signUp(user: CreateUserDto): Observable<UserDto> {
        return this.http.post<UserDto>(this.authUrl, user)
            .pipe(
                tap(user => this.user = user)
            );
    }

    signInWithAccessToken(): Observable<UserDto> {
        const accessToken = localStorage.getItem('accessToken');
        return this.http.post<UserDto>(`${ this.authUrl }/sign-in-with-access-token`, { accessToken })
            .pipe(
                tap(user => this.user = user)
            );
    }

    signOut(): void {
        this.user = null;
    }
}
