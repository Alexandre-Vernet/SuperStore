import { Injectable } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { catchError, Observable, of, switchMap, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { ErrorService } from '../../error/error.service';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    addressUrl = environment.addressUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly errorService: ErrorService
    ) {
    }

    createAddress(address: AddressDto): Observable<AddressDto> {
        return this.http.post<AddressDto>(this.addressUrl, address);
    }

    findAllUserAddresses(): Observable<AddressDto[]> {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => this.http.post<AddressDto[]>(`${ this.addressUrl }/find-all`, { userId: user.id }))
            );
    }

    updateAddress(address: AddressDto): Observable<AddressDto> {
        return this.http.put<AddressDto>(`${ this.addressUrl }/${ address.id }`, address);
    }

    deleteAddress(address: AddressDto) {
        return this.http.delete(`${ this.addressUrl }/${ address.id }`)
            .pipe(
                catchError((err) => {
                    this.errorService.setError(err.error.message);
                    return of(null);
                })
            );
    }
}
