import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressDto, UserDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../address.service';
import { AuthService } from '../../../auth/auth.service';
import { distinctUntilChanged, map, Subject, switchMap, takeUntil, combineLatest } from 'rxjs';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-address',
    templateUrl: './create-address.component.html',
    styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit, OnDestroy {

    user: UserDto;
    addresses: AddressDto[] = [];
    formAddress = new FormGroup({
        id: new FormControl(),
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
        private readonly authService: AuthService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        combineLatest([this.authService.user$, this.addressService.findAllUserAddresses()])
            .pipe(
                takeUntil(this.unsubscribe$),
                map(([user, addresses]) => {
                    this.user = user;
                    this.addresses = addresses;
                })
            );

        this.buttonAddAddress$.pipe(
            distinctUntilChanged(),
            takeUntil(this.unsubscribe$),
            map(() => this.formAddress.value),
            switchMap((address) => {
                    const addressDto: AddressDto = {
                        user: this.user,
                        company: address.company ? address.company.trim() : null,
                        address: address.address.trim(),
                        apartment: address.apartment ? address.apartment.trim() : null,
                        country: address.country.trim(),
                        city: address.city.trim(),
                        zipCode: address.zipCode,
                        phone: address.phone
                    };

                    if (this.formAddress.get('id')?.value) {
                        return this.addressService.updateAddress({
                            id: this.formAddress.get('id').value,
                            ...addressDto
                        });
                    } else {
                        return this.addressService.createAddress(addressDto);
                    }
                }
            )
        )
            .subscribe({
                next: () => {
                    this.clearFormAddress();
                    if (this.formAddress.get('id')?.value) {
                        this.notificationService.showSuccessNotification('Success', 'Address updated successfully');
                    } else {
                        this.notificationService.showSuccessNotification('Success', 'Address created successfully');
                    }
                },
                error: (err) => {
                    this.formAddress.setErrors({ [err.error.field ?? 'address']: err.error.message });
                }
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    selectAddress(address: AddressDto | null) {
        if (!address) {
            this.clearFormAddress();
            return;
        }
        this.formAddress.patchValue({
            id: address.id,
            company: address?.company,
            address: address.address,
            apartment: address?.apartment,
            country: address.country,
            city: address.city,
            zipCode: address.zipCode,
            phone: address.phone
        });
    }

    clearFormAddress() {
        this.formAddress.reset();
    }
}
