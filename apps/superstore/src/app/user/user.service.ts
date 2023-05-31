import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AddressDto, CreateAddressDto, UserDto } from "@superstore/libs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    userUrl = environment.userUrl();
    addressUrl = environment.addressUrl();

    constructor(
        private readonly authService: AuthService,
        private readonly http: HttpClient,
    ) {
    }

    getUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${ this.userUrl }`);
    }

    getUser(userId: number): Observable<UserDto> {
        return this.http.get<UserDto>(`${ this.userUrl }/${ userId }`);
    }

    updateUser(user: UserDto): Observable<UserDto> {
        return this.http.put<UserDto>(`${ this.userUrl }/${ user.id }`, user);
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${ this.userUrl }/${ userId }`);
    }

    createAddress(address: CreateAddressDto): Observable<AddressDto> {
        return this.http.post<AddressDto>(this.addressUrl, address);
    }

    getAddresses(): Observable<AddressDto[]> {
        const userId = this.authService.user.id;
        return this.http.post<AddressDto[]>(`${ this.addressUrl }/find-all`, { userId });
    }

    getAddress(addressId: number): Observable<AddressDto> {
        return this.http.get<AddressDto>(`${ this.addressUrl }/${ addressId }`);
    }
}
