import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../../address/address.service';
import { AuthService } from '../../auth/auth.service';
import { map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {

    addresses: AddressDto[] = [];
    selectedAddress: AddressDto;
    formAddress = new FormGroup({
        company: new FormControl(),
        address: new FormControl('', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required])
    });

    buttonAddAddress$ = new Subject<void>();
    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly addressService: AddressService,
        private readonly authService: AuthService
    ) {
    }

    ngOnInit() {
        this.addressService.getUserAddresses()
            .subscribe(addresses => {
                if (addresses) {
                    this.addresses = addresses;
                    this.selectedAddress = addresses[0];

                    this.formAddress.patchValue({
                        company: addresses[0]?.company,
                        address: addresses[0]?.address,
                        apartment: addresses[0]?.apartment,
                        country: addresses[0]?.country,
                        city: addresses[0]?.city,
                        zipCode: addresses[0]?.zipCode,
                        phone: addresses[0]?.phone
                    });
                }
            });

        this.buttonAddAddress$.pipe(
            takeUntil(this.unsubscribe$),
            map(() => this.formAddress.value),
            switchMap((address) => {
                    const addressDto: AddressDto = {
                        user: this.authService.user,
                        company: address.company,
                        address: address.address,
                        apartment: address.apartment,
                        country: address.country,
                        city: address.city,
                        zipCode: address.zipCode,
                        phone: address.phone
                    };

                    if (this.selectedAddress && this.selectedAddress.id) {
                        return this.addressService.updateAddress({
                            id: this.selectedAddress.id,
                            ...addressDto
                        });
                    } else {
                        return this.addressService.createAddress(addressDto);
                    }
                }
            )
        )
            .subscribe({
                next: (newAddress) => {
                    if (this.selectedAddress && this.selectedAddress.id) {
                        const index = this.addresses.findIndex(a => a.id === newAddress.id);
                        this.addresses[index] = newAddress;
                    } else {
                        this.addresses.push(newAddress);
                    }
                    this.clearFormAddress();
                    this.selectAddress(newAddress);
                },
                error: (err) => this.formAddress.setErrors({ [err.error.field ?? 'address']: err.error.message })
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    clearFormAddress() {
        this.formAddress.reset();
        this.selectedAddress = null;
    }

    selectAddress(address: AddressDto) {
        this.selectedAddress = address;
        this.formAddress.patchValue({
            company: address.company,
            address: address.address,
            apartment: address.apartment,
            country: address.country,
            city: address.city,
            zipCode: address.zipCode,
            phone: address.phone
        });
    }

    removeAddress(address: AddressDto) {
        this.addressService.deleteAddress(address)
            .subscribe(() => {
                this.addresses = this.addresses.filter(a => a.id !== address.id);
                this.clearFormAddress();
                if (this.addresses[0]) {
                    this.selectAddress(this.addresses[0]);
                }
            });
    }
}
