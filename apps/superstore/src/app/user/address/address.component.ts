import { Component, OnInit } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../../address/address.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'superstore-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

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

    submitForm() {
        if (this.formAddress.valid) {
            this.createAddress();
        }
    }

    createAddress() {
        const address = this.formAddress.value;

        this.addressService
            .createAddress({
                user: this.authService.user,
                company: address.company,
                address: address.address,
                apartment: address.apartment,
                country: address.country,
                city: address.city,
                zipCode: address.zipCode,
                phone: address.phone
            })
            .subscribe((newAddress) => {
                if (this.addresses.length === 0) {
                    this.addresses.push(newAddress);
                    this.selectAddress(newAddress);
                    return;
                }
                const index = this.addresses.findIndex(a => a.id === newAddress.id);
                this.addresses.find(a => a.id === newAddress.id) ?
                    this.addresses[index] = newAddress :
                    this.addresses.push(newAddress);
                this.clearFormAddress();
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
