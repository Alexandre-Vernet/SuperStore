import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateUserDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
    ) {
    }

    signUp(user: CreateUserDto): Observable<void> {
        return this.http.post<void>(environment.authUrl(), user);
    }
}
