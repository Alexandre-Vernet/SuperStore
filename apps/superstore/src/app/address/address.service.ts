import { Injectable } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ErrorService } from '../error/error.service';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    addressUrl = environment.addressUrl();
    private addressesSubject = new BehaviorSubject<AddressDto[]>([]);
    addresses$ = this.addressesSubject.asObservable();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly notificationService: NotificationsService,
        private readonly errorService: ErrorService
    ) {
        this.getUserAddresses().subscribe();
    }

    createAddress(address: AddressDto): Observable<AddressDto> {
        return this.http.post<AddressDto>(this.addressUrl, address)
            .pipe(
                tap(address => this.addressesSubject.next([...this.addressesSubject.getValue(), address]))
            );
    }

    getUserAddresses(): Observable<AddressDto[]> {
        const userId = this.authService.user.id;
        return this.http.post<AddressDto[]>(`${ this.addressUrl }/find-all`, { userId })
            .pipe(
                tap((address) => this.addressesSubject.next(address))
            );
    }

    getAddress(addressId: number): Observable<AddressDto> {
        return this.http.get<AddressDto>(`${ this.addressUrl }/${ addressId }`);
    }

    updateAddress(address: AddressDto): Observable<AddressDto> {
        return this.http.put<AddressDto>(`${ this.addressUrl }/${ address.id }`, address)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Address updated successfully');
                    const addresses = this.addressesSubject.getValue();
                    const index = addresses.findIndex(a => a.id === address.id);
                    addresses[index] = address;
                    this.addressesSubject.next(addresses);
                })
            );
    }

    deleteAddress(address: AddressDto) {
        return this.http.delete(`${ this.addressUrl }/${ address.id }`)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Address deleted successfully');
                    const addresses = this.addressesSubject.getValue();
                    this.addressesSubject.next(addresses.filter(a => a.id !== address.id));
                }),
                catchError((err) => {
                    this.errorService.setError(err.error.message);
                    return of(null);
                })
            );
    }
}
