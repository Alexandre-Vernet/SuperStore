import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { AddressService } from '../address.service';
import { BehaviorSubject, filter, Subject, tap } from 'rxjs';

@Component({
    selector: 'superstore-list-addresses',
    templateUrl: './list-addresses.component.html',
    styleUrls: ['./list-addresses.component.scss']
})
export class ListAddressesComponent implements OnInit, OnDestroy {
    addresses: AddressDto[] = [];
    @Output() selectedAddress$ = new BehaviorSubject<AddressDto>(null);

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly addressService: AddressService
    ) {
    }

    ngOnInit() {
        this.addressService.addresses$
            .pipe(
                filter(addresses => addresses.length > 0),
                tap(addresses => this.emitSelectAddress(addresses[0])),
                tap(addresses => (this.addresses = addresses))
            )
            .subscribe();

    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    emitSelectAddress(address: AddressDto | null) {
        this.selectedAddress$.next(address);
    }

    removeAddress(address: AddressDto) {
        this.addressService.deleteAddress(address)
            .subscribe(() => {
                if (this.addresses.length) {
                    this.selectedAddress$.next(this.addresses[0]);
                }
            });
    }
}
