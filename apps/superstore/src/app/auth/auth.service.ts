import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateUserDto, SignInUserDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
    ) {
    }

    signIn(user: SignInUserDto): Observable<void> {
        return this.http.post<void>(`${ environment.authUrl() }/sign-in`, user);
    }

    signUp(user: CreateUserDto): Observable<void> {
        return this.http.post<void>(environment.authUrl(), user);
    }
}
