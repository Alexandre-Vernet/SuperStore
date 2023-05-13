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

    constructor(
        private http: HttpClient,
    ) {
    }

    signIn(user: SignInUserDto): Observable<UserDto> {
        return this.http.post<UserDto>(`${ environment.authUrl() }/sign-in`, user)
            .pipe(
                tap(user => this.user = user)
            );
    }

    signUp(user: CreateUserDto): Observable<void> {
        return this.http.post<void>(environment.authUrl(), user);
    }
}
