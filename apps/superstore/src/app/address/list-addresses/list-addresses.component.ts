import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { AddressService } from '../address.service';
import { BehaviorSubject, combineLatest, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-list-addresses',
    templateUrl: './list-addresses.component.html',
    styleUrls: ['./list-addresses.component.scss']
})
export class ListAddressesComponent implements OnInit, OnDestroy {
    addresses: AddressDto[] = [];
    @Output() selectedAddress = new BehaviorSubject<AddressDto>(null);

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly addressService: AddressService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.selectedAddress.pipe(distinctUntilChanged()),
            this.addressService.addresses$.pipe(distinctUntilChanged())
        ])
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(([selectedAddress, addresses]) => {
                if (!selectedAddress && addresses) {
                    this.selectAddress(addresses[0]);
                } else if (!selectedAddress && !addresses) {
                    this.selectAddress(null);
                } else {
                    this.selectAddress(selectedAddress);
                }

                this.addresses = addresses;
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    selectAddress(address: AddressDto) {
        this.selectedAddress.next(address);
    }

    removeAddress(address: AddressDto) {
        this.addressService.deleteAddress(address)
            .subscribe(() => {
                if (this.addresses.length) {
                    this.selectedAddress.next(this.addresses[0]);
                }
            });
    }
}
