import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
    ) {
    }

    signUp(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ): Observable<void> {
        return this.http.post<void>(environment.authUrl(), {
            firstName, lastName, email, password
        });
    }
}
