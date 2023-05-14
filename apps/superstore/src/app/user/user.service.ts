import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AddressDto } from "@superstore/libs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    addressUrl = environment.addressUrl();

    constructor(
        private readonly authService: AuthService,
        private readonly http: HttpClient,
    ) {
    }

    getAddresses(): Observable<AddressDto[]> {
        const userId = this.authService.user.id;
        return this.http.post<AddressDto[]>(`${ this.addressUrl }/find-all`, { userId });
    }
}
