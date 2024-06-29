import { Injectable } from '@angular/core';
import { AddressDto } from "@superstore/interfaces";
import { catchError, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { NotificationsService } from "../shared/notifications/notifications.service";
import { UserService } from "../user/user.service";

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    addressUrl = environment.addressUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly notificationService: NotificationsService
    ) {
    }

    createAddress(address: Omit<AddressDto, 'id'>): Observable<AddressDto> {
        const userId = this.authService.user.id;
        return this.http.post<AddressDto>(this.addressUrl, { address, userId });
    }

    getUserAddresses(): Observable<AddressDto[]> {
        const userId = this.authService.user.id;
        return this.http.post<AddressDto[]>(`${ this.addressUrl }/find-all`, { userId });
    }

    getAddress(addressId: number): Observable<AddressDto> {
        return this.http.get<AddressDto>(`${ this.addressUrl }/${ addressId }`);
    }

    deleteAddress(address: AddressDto) {
        return this.http.delete(`${ this.addressUrl }/${ address.id }`)
            .pipe(
                tap(() => {
                    const user = this.authService.user;
                    user.addresses = user.addresses.filter(address => address.id !== address.id);
                    return this.userService.updateUser(user)
                        .subscribe(() => {
                            this.notificationService.showSuccessNotification('Success', 'Address deleted successfully');
                        })
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }
}
