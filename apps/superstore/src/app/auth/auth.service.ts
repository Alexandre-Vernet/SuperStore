import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { AddressDto, CreateUserDto, SignInUserDto, UserDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: UserDto;
    authUrl = environment.authUrl();
    addressUrl = environment.addressUrl();

    constructor(
        private http: HttpClient,
    ) {
    }

    signIn(user: SignInUserDto): Observable<UserDto> {
        return this.http.post<UserDto>(`${ this.authUrl }/sign-in`, user)
            .pipe(
                tap(user => this.user = user)
            );
    }

    signUp(user: CreateUserDto): Observable<UserDto> {
        return this.http.post<UserDto>(this.authUrl, user)
            .pipe(
                tap(user => this.user = user)
            );
    }

    signOut(): void {
        this.user = null;
    }

    getAddresses(): Observable<AddressDto> {
        const userId = this.user.id;
        return this.http.post<AddressDto>(`${this.addressUrl}/find-all`, { userId });
    }
}
